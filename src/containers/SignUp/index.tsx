import { useMemo, useState } from 'react';
import { StyledSignUp } from './style';
import { DatePicker, Form, Input, message } from 'antd';
import { AuthApi, ResponseSignUp, RequestSignUp } from 'modules/auth';
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  MailOutlined,
  SmileOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { BasicButton } from 'components';
import { useForm } from 'antd/es/form/Form';
import { useHistory } from 'react-router';
import { ROUTE_SIGN_UP } from 'routes/const';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';

export const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [form] = useForm();
  const hisyory = useHistory();
  const queryClient = useQueryClient();

  const authApi = useMemo(() => {
    return new AuthApi();
  }, []);

  const onChangePasswordVisible = () => {
    setPasswordVisible((prev) => !prev);
  };

  const { mutateAsync } = useMutation<ResponseSignUp, AxiosError, any>(
    ['QUERY_SIGN_UP'],
    async (data: RequestSignUp) => await authApi.userSignUp(data),
    {
      onSuccess: (data) => {
        message.success('회원가입에 성공하였습니다.');

        hisyory.push(ROUTE_SIGN_UP);

        return queryClient.invalidateQueries(['QUERY_SIGN_UP']);
      },
      onMutate: async () => {
        const previousData = queryClient.getQueryData(['QUERY_SIGN_UP']);
        await queryClient.cancelQueries(['QUERY_SIGN_UP']);

        return { previousData };
      },

      // onError: (data, values, context) => {
      //   if (context?.previousData) {
      //     queryClient.setQueryData(['QUERY_SIGN_UP'], context.previousData);
      //   }

      //   return;
      // },
      onSettled: () => {
        return queryClient.invalidateQueries(['QUERY_SIGN_UP']);
      }
    }
  );

  const onSubmit = async (values: RequestSignUp) => {
    try {
      const { birthday, ...rest } = values;

      const result = {
        ...rest,
        birthday: dayjs(birthday).format('YYYYMMDD')
      };

      await mutateAsync(result);
    } catch (e: any) {
      message.error(e.message[0] || e.message);
    }
  };

  const onSignIn = () => {
    hisyory.push(ROUTE_SIGN_UP);
  };

  return (
    <StyledSignUp>
      <div className="signup-wrapper">
        <div className="signup-wrapper-header">
          <h2>회원가입</h2>
          <p>회원가입을 하시면 다양한 정보들을 구경 할 수 있습니다.</p>
        </div>

        <div className="signup-wrapper-body">
          <Form
            className="signup-wrapper-body-form"
            form={form}
            onFinish={onSubmit}
            initialValues={{
              userid: '',
              password: '',
              save: false
            }}
          >
            <Form.Item
              name="userid"
              rules={[
                {
                  type: 'string',
                  required: true,
                  message: '아이디를 확인 해주세요.'
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
              <Input
                prefix={<UserOutlined className="input-icons" />}
                placeholder="아이디를 입력해주세요."
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
                placeholder="비밀번호를 입력해주세요."
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

            <Form.Item name="birthday">
              <DatePicker placeholder="생년월일을 선택해주세요." />
            </Form.Item>

            <div className="signup-wrapper-body-form-btns">
              <div className="signup-wrapper-body-form-btns-submit">
                <BasicButton btnText="Sign Up" htmlType="submit" />
              </div>
              <div className="signup-wrapper-body-form-btns-signup">
                <p>
                  Already have an account?{' '}
                  <span onClick={onSignIn}>Sign In</span>
                </p>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </StyledSignUp>
  );
};
