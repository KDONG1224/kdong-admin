// base
import React from 'react';

// style
import { StyledDragSortTable } from './style';

import { TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { MenuOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

interface DragSortTableProps<T> extends TableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  setSequence: (value: any) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

const Row = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props['data-row-key']
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: 'none', cursor: 'move' }}
                {...listeners}
              />
            )
          });
        }
        return child;
      })}
    </tr>
  );
};

export const DragSortTable = <T extends {}>({
  columns,
  dataSource,
  setSequence,
  onDragEnd,
  ...props
}: DragSortTableProps<T>) => {
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    console.log('== active, over == : ', active, over);

    if (active.id !== over?.id) {
      setSequence((prev: any) => {
        const activeIndex = prev.findIndex(
          (i: any) => i.sequence === active.id
        );
        const overIndex = prev.findIndex((i: any) => i.sequence === over?.id);

        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  console.log('= dataSource = : ', dataSource);

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <SortableContext
        items={
          dataSource.length > 0 ? dataSource.map((i: any) => i.sequence) : []
        }
        strategy={verticalListSortingStrategy}
      >
        <StyledDragSortTable
          components={{
            body: {
              row: Row
            }
          }}
          rowKey="sequence"
          columns={columns}
          dataSource={dataSource}
          {...props}
        />
      </SortableContext>
    </DndContext>
  );
};
