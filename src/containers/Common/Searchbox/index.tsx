import { StyledSearchbox } from './style';
import { Descriptions, Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormInstance } from 'antd/lib';
import { BasicButton, BasicDateRangePicker } from 'components';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  ResponseSubCategoryLists,
  CategoryListsProps,
  QUERY_GET_SUB_CATEGORY,
  CategoryApi
} from 'modules/category';
import { useMemo } from 'react';

export interface AdditionalProps {
  [key: string]: any;
}

export interface SearchboxStateProps<T extends AdditionalProps> {
  where__dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  where__category: string;
  where__type: string;
  where__title: string;
  additionalProps: T;
}

interface customFormItems {
  title: string;
  name: string;
  key?: string;
  render: (form: FormInstance) => React.ReactNode;
}

interface SearchboxProps {
  customFormItems?: customFormItems[];
  onSearch: <T extends AdditionalProps>(values: T) => void;
}

export const Searchbox: React.FC<SearchboxProps> = ({
  customFormItems,
  onSearch
}) => {
  const [form] = useForm();

  const categoryApi = useMemo(() => {
    return new CategoryApi();
  }, []);

  const { data: categories } = useQuery<
    ResponseSubCategoryLists,
    AxiosError,
    CategoryListsProps[]
  >(
    [QUERY_GET_SUB_CATEGORY],
    async () => {
      return await categoryApi.getAllSubCategories();
    },
    {
      select: (data) => {
        return data.result.subCategories as CategoryListsProps[];
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  );

  const onChangeDateRange = (
    values: [dayjs.Dayjs, dayjs.Dayjs],
    dateString: [string, string]
  ) => {
    console.log(values, dateString);
  };

  const onRest = () => {
    form.resetFields();
  };

  const onFinish = <T extends AdditionalProps>(values: T) => {
    onSearch(values);
  };

  return (
    <StyledSearchbox>
      <Form className="search-wrapper" form={form} onFinish={onFinish}>
        <Descriptions>
          <Descriptions.Item label="검색기간" span={3}>
            <div className="flex-box">
              <Form.Item name="where__dateRange">
                <BasicDateRangePicker
                  onChange={(values, dateString) =>
                    onChangeDateRange(
                      values as [dayjs.Dayjs, dayjs.Dayjs],
                      dateString
                    )
                  }
                />
              </Form.Item>
              <BasicButton btnText="전일" />
              <BasicButton btnText="7일전" />
              <BasicButton btnText="한달전" />
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="검색타입" span={3}>
            <div className="flex-box">
              <Form.Item name="where__category">
                <Select
                  placeholder="카테고리를 선택해주세요."
                  options={
                    categories
                      ? categories.map((category) => ({
                          ...category,
                          label: category.categoryName,
                          value: category.categoryName
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item name="where__type">
                <Input />
              </Form.Item>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="검색어" span={3}>
            <Form.Item name="where__title">
              <Input />
            </Form.Item>
          </Descriptions.Item>

          {customFormItems &&
            customFormItems.map((item: customFormItems) => (
              <Descriptions.Item label={item.title} span={3} key={uuidv4()}>
                <Form.Item name={item.name}>{item.render(form)}</Form.Item>
              </Descriptions.Item>
            ))}
        </Descriptions>

        <div className="search-wrapper-bottom">
          <BasicButton btnText="검색" htmlType="submit" />
          <BasicButton btnText="초기화" onClick={onRest} />
        </div>
      </Form>
    </StyledSearchbox>
  );
};
