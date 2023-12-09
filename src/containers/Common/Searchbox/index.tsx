import { StyledSearchbox } from './style';
import { Descriptions, Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormInstance } from 'antd/lib';
import { BasicButton, BasicDateRangePicker } from 'components';
import { SearchboxStateProps } from 'containers/Article';
import { v4 as uuidv4 } from 'uuid';

interface T extends SearchboxStateProps {}

interface customFormItems {
  title: string;
  name: string;
  key?: string;
  render: (form: FormInstance) => React.ReactNode;
}

interface SearchboxProps {
  customFormItems?: customFormItems[];
  onSearch: (values: T) => void;
}

export const Searchbox: React.FC<SearchboxProps> = ({
  customFormItems,
  onSearch
}) => {
  const [form] = useForm();

  const onChangeDateRange = (values: any, dateString: [string, string]) => {
    console.log(values, dateString);
  };

  const onRest = () => {
    form.resetFields();
  };

  const onFinish = (values: T) => {
    console.log(values);

    onSearch(values);
  };

  return (
    <StyledSearchbox>
      <Form className="search-wrapper" form={form} onFinish={onFinish}>
        <Descriptions>
          <Descriptions.Item label="검색기간" span={3}>
            <div className="flex-box">
              <Form.Item name="search-date-range">
                <BasicDateRangePicker
                  onChange={(values, dateString) =>
                    onChangeDateRange(values, dateString)
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
              <Form.Item name="search-category">
                <Select placeholder="카테고리를 선택해주세요." options={[]} />
              </Form.Item>

              <Form.Item name="search-type">
                <Input />
              </Form.Item>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="검색어" span={3}>
            <Form.Item name="search-keyword">
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
