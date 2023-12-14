// base
import React, { useCallback, useEffect, useState } from 'react';

// styles
import { StyledFaqEditModal } from './style';

// components
import { BasicButton } from 'components';

// modules
import { FaqListsProps, RequestProfileFaqFormProps } from 'modules/profile';

// libraries
import { Col, Descriptions, Form, Input, ModalProps, Row, Select } from 'antd';
import { faqTypeList } from 'consts';
import { useForm } from 'antd/es/form/Form';

interface FaqEditModalProps extends ModalProps {
  data?: FaqListsProps | undefined;
  onClose: () => void;
  onSubmit: (values: RequestProfileFaqFormProps) => void;
}

export const FaqEditModal: React.FC<FaqEditModalProps> = ({
  data,
  onClose,
  onSubmit,
  ...props
}) => {
  const [initialValues, setInitialValues] =
    useState<RequestProfileFaqFormProps>();

  const [form] = useForm();

  const onInitValues = useCallback(() => {
    if (!data) return;

    form.setFieldsValue({ ...data });
    setInitialValues({ ...data });
  }, [data, form]);

  const handleCloseModal = () => {
    const init = {
      question: '',
      answer: '',
      faqType: ''
    };

    form.setFieldsValue(init);
    setInitialValues(init);
    onClose();
  };

  const onFinish = (values: RequestProfileFaqFormProps) => {
    onSubmit(values);
    handleCloseModal();
  };

  useEffect(() => {
    onInitValues();
  }, [onInitValues]);

  return (
    <StyledFaqEditModal
      {...props}
      centered
      closable
      title={!data ? '질문 & 답변 생성' : '질문 & 답변 수정'}
      footer={false}
      width={600}
      destroyOnClose
      onCancel={handleCloseModal}
    >
      <div className="modal-wrapper">
        <Form form={form} onFinish={onFinish} initialValues={initialValues}>
          <Descriptions bordered column={24}>
            <Descriptions.Item label="* 분류 선택" span={24}>
              <Row style={{ width: '100%' }}>
                <Col style={{ width: '100%' }}>
                  <Form.Item
                    name="faqType"
                    rules={[
                      { required: true, message: '타입을 입력해주세요.' }
                    ]}
                    noStyle
                  >
                    <Select
                      style={{ width: '100%' }}
                      disabled={(data && true) as boolean}
                    >
                      {faqTypeList.map(({ label, value }) => (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Descriptions.Item>
            <Descriptions.Item label="* 질문" span={24}>
              <Form.Item
                name="question"
                rules={[{ required: true, message: '질문을 입력해주세요.' }]}
              >
                <Input.TextArea
                  spellCheck={false}
                  maxLength={1000}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  style={{ resize: 'none', width: '100%' }}
                />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="* 답변" span={24}>
              <Form.Item
                name="answer"
                rules={[{ required: true, message: '답변을 입력해주세요.' }]}
              >
                <Input.TextArea
                  spellCheck={false}
                  maxLength={1000}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  style={{ resize: 'none', width: '100%' }}
                />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>
          <div
            style={{
              marginTop: '20px',
              textAlign: 'center'
            }}
          >
            <BasicButton btnText="취소" onClick={handleCloseModal} />
            {!data ? (
              <BasicButton
                type="primary"
                htmlType="submit"
                style={{ marginLeft: '5px' }}
                btnText="등록"
              />
            ) : (
              <BasicButton
                type="primary"
                htmlType="submit"
                style={{ marginLeft: '5px' }}
                btnText="수정"
              />
            )}
          </div>
        </Form>
      </div>
    </StyledFaqEditModal>
  );
};
