import React, { useState } from 'react';
import { StyledPasswordModal } from './style';
import { Form, Input, ModalProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import {
  SmileOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import { ForgotPasswordProps } from 'modules/auth';

interface PasswordModalProps extends ModalProps {
  onClose: () => void;
  onSubmit: (values: ForgotPasswordProps) => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  onClose,
  onSubmit,
  ...props
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [form] = useForm();

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const onChangePasswordVisible = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <StyledPasswordModal
      {...props}
      centered
      maskClosable
      onCancel={handleClose}
    >
      <div className="find-wrapper">
        <div className="find-wrapper-title">
          <h2>비밀번호 찾기</h2>
        </div>

        <div className="find-wrapper-body">
          <Form
            className="find-wrapper-body-form"
            form={form}
            initialValues={{
              username: '',
              email: '',
              password: '',
              phoneNumber: ''
            }}
            onFinish={onSubmit}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  type: 'string',
                  required: true,
                  message: '이름을 확인 해주세요.'
                }
              ]}
            >
              <Input
                prefix={<SmileOutlined className="input-icons" />}
                placeholder="이름을 입력해주세요."
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: '이메일을 확인 해주세요.'
                }
              ]}
            >
              <Input
                prefix={<MailOutlined className="input-icons" />}
                placeholder="이메일을 입력해주세요."
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  type: 'string',
                  required: true,
                  message: '비밀번호를 확인 해주세요.'
                },
                {
                  validator: (_, value) => {
                    const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

                    if (korean.test(value)) {
                      return Promise.reject('한글은 입력하실수 없습니다.');
                    } else {
                      return Promise.resolve();
                    }
                  }
                }
              ]}
            >
              <Input.Password
                placeholder="새로운 비밀번호를 입력해주세요."
                prefix={<LockOutlined className="input-icons" />}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: onChangePasswordVisible
                }}
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone className="input-icons" color="#000" />
                  ) : (
                    <EyeInvisibleOutlined className="input-icons" />
                  )
                }
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  type: 'string',
                  required: true,
                  message: '휴대전화 번호를 확인 해주세요.'
                }
              ]}
            >
              <Input
                maxLength={11}
                prefix={<PhoneOutlined className="input-icons" />}
                placeholder="휴대전화를 입력해주세요."
              />
            </Form.Item>

            {/* <div className="find-wrapper-body-form-btns">
              <BasicButton
                className="confirm"
                btnText="확인"
                htmlType="submit"
              />
              <BasicButton
                className="cancel"
                btnText="취소"
                onClick={handleClose}
              />
            </div> */}
          </Form>
        </div>
      </div>
    </StyledPasswordModal>
  );
};
