// base
import { Key, useMemo, useState } from 'react';

// styles
import { StyledArticleCategory } from './style';

// components
import { BasicButton, CategoryEditModal } from 'components';

// modules
import {
  QUERY_CREATE_CATEGORY,
  QUERY_GET_MAIN_CATEGORYS,
  QUERY_GET_SUB_CATEGORY,
  QUERY_UPDATE_CATEGORY
} from 'modules/category/queries/category.query';
import { CategoryApi } from 'modules/category';

// libraries
import { Table, message } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';

export const ArticleCategory = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isSelectRow, setIsSelectRow] = useState<any>(null);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [isActiveValue, setIsActiveValue] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] =
    useState<boolean>(false);

  const categoryApi = useMemo(() => {
    return new CategoryApi();
  }, []);

  const mainColumns = useMemo(() => {
    return [
      {
        key: 'categoryName',
        dataIndex: 'categoryName',
        title: '대 카테고리'
      }
    ];
  }, []);

  const subColumns = useMemo(() => {
    return [
      {
        key: 'categoryName',
        dataIndex: 'categoryName',
        title: '세부 카테고리',
        width: 400
      },
      {
        key: 'action',
        dataIndex: 'action',
        title: (
          <BasicButton
            btnText="ADD"
            onClick={() => {
              setIsEdit(false);
              setIsActiveValue('');
              setIsSelectRow(null);
              onVisibleEditModal();
            }}
          />
        ),
        render: (text: any, record: any) => {
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.8rem'
              }}
            >
              {/* <BasicButton btnText="삭제" /> */}
              <BasicButton
                btnText="수정"
                onClick={() => {
                  setIsEdit(true);
                  setIsActiveValue(record.categoryName);
                  setIsSelectRow(record);
                  onVisibleEditModal();
                }}
              />
            </div>
          );
        }
      }
    ];
  }, []);

  const { mutateAsync: getSubCategory } = useMutation(
    [QUERY_GET_SUB_CATEGORY, selectedRowKeys, isCategoryEditModalOpen],
    async (id: string) => {
      return await categoryApi.getSubCategories(id);
    },
    {
      onSuccess: (data) => {
        if (!data) return;

        const sortedData = data.result.subCategories.sort(
          (a: any, b: any) => a.subCategoryNumber - b.subCategoryNumber
        );

        setSubCategories(sortedData);
      },
      onError: (error) => {
        console.log(error);
      }
    }
  );

  const { data: mainCategories } = useQuery(
    [QUERY_GET_MAIN_CATEGORYS],
    async () => {
      return await categoryApi.getMainCategories();
    },
    {
      select: (data) => data.result.categories,
      onSuccess: async (data) => {
        if (!data) return;

        setSelectedRowKeys([data[0].id]);
        await getSubCategory(data[0].id);
      }
    }
  );

  const { mutateAsync: createSubCategory } = useMutation(
    [QUERY_CREATE_CATEGORY, selectedRowKeys, isCategoryEditModalOpen],
    async (data: any) => {
      return await categoryApi.createCategory(data);
    },
    {
      onSuccess: async (data) => {
        if (!data) return;

        const findMainCategory = mainCategories?.find(
          (m: any) => m.id === selectedRowKeys[0]
        );

        if (findMainCategory) {
          await getSubCategory(findMainCategory.id);
        }

        onVisibleEditModal();
        setIsSelectRow(null);
        setIsActiveValue('');
      }
    }
  );

  const { mutateAsync: updateCategory } = useMutation(
    [QUERY_UPDATE_CATEGORY],
    async (datas: any) => {
      const { id, data } = datas;

      return await categoryApi.updateCategory(id, data);
    },
    {
      onSuccess: async (data) => {
        if (!data) return;

        const findMainCategory = mainCategories?.find(
          (m: any) => m.id === selectedRowKeys[0]
        );

        if (findMainCategory) {
          await getSubCategory(findMainCategory.id);
        }

        onVisibleEditModal();
        setIsSelectRow(null);
        setIsActiveValue('');
      }
    }
  );

  const onVisibleEditModal = () => {
    setIsEdit(false);
    setIsCategoryEditModalOpen((prev) => !prev);
  };

  const onMainRowClick = (record: any) => {
    return {
      onClick: async () => {
        try {
          setSelectedRowKeys([record.id]);
          await getSubCategory(record.id);
        } catch (e: any) {
          message.error(e.message);
        }
      }
    };
  };

  const onChangeInput = (value: string) => {
    setIsActiveValue(value);
  };

  const onEditCategorySubmit = async () => {
    try {
      if (!isEdit) {
        const lastItem = subCategories[subCategories.length - 1];

        if (!isActiveValue) return;

        await createSubCategory({
          categoryName: isActiveValue,
          categoryNumber: lastItem.categoryNumber,
          subCategoryNumber: lastItem.subCategoryNumber + 1
        });

        return;
      }

      if (!isSelectRow) return;

      await updateCategory({
        id: isSelectRow.id as string,
        data: {
          categoryName: isActiveValue
        }
      });
    } catch (e: any) {
      onVisibleEditModal();
      setIsSelectRow(null);
      setIsActiveValue('');

      message.error(e.message);
    }
  };

  return (
    <>
      <StyledArticleCategory>
        <div className="category-wrapper">
          <div className="category-wrapper-left">
            <Table
              columns={mainColumns}
              dataSource={mainCategories}
              pagination={false}
              onRow={onMainRowClick}
              rowKey="id"
              rowSelection={{
                selectedRowKeys
              }}
            />
          </div>
          <div className="category-wrapper-right">
            <Table
              columns={subColumns}
              dataSource={subCategories}
              pagination={false}
            />
          </div>
        </div>
      </StyledArticleCategory>

      <CategoryEditModal
        open={isCategoryEditModalOpen}
        value={isActiveValue}
        isEdit={isEdit}
        onChangeInput={onChangeInput}
        onCancel={onVisibleEditModal}
        onOk={onEditCategorySubmit}
      />
    </>
  );
};
