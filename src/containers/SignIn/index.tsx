// base
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';

// style
import { StyledSignIn } from './style';

// components
import { BasicButton } from 'components';

// modules
import { RequestSignIn } from 'modules';
import { AuthApi, userLoginState } from 'modules/auth';

// services
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  COOKIE_SAVE_ID,
  cookieStorage
} from 'services/cookie';

// routes
import { ROUTE_ROOT, ROUTE_SIGN_UP } from 'routes/const';

// libraries
import { useSetRecoilState } from 'recoil';
import { Checkbox, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined
} from '@ant-design/icons';

export const SignIn = () => {
  const [isSaveId, setIsSaveId] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  // const [isForgotPassword, setIsForgotPassword] = useState(false);

  const setUserInfo = useSetRecoilState(userLoginState);

  const [form] = useForm();
  const hisyory = useHistory();

  const authApi = useMemo(() => {
    return new AuthApi();
  }, []);

  const onChangePasswordVisible = () => {
    setPasswordVisible((prev) => !prev);
  };

  const onChangeSaveId = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;

    setIsSaveId(checked);
    form.setFieldValue('save', checked);
  };

  // const onVisibleForgotPassword = () => {
  //   setIsForgotPassword((prev) => !prev);
  // };

  const onSubmit = async (data: RequestSignIn) => {
    try {
      const { userid, password, save } = data;
      const res = await authApi.usersLogin({ userid, password });

      cookieStorage.setCookie(COOKIE_ACCESS_TOKEN, res.result.accessToken);
      cookieStorage.setCookie(COOKIE_REFRESH_TOKEN, res.result.refreshToken);

      if (save) {
        sessionStorage.setItem(COOKIE_SAVE_ID, userid);
      } else {
        sessionStorage.removeItem(COOKIE_SAVE_ID);
      }

      setUserInfo({ userInfo: res.result.userInfo, isLogin: true });
      hisyory.replace(ROUTE_ROOT);
    } catch (error) {
      console.error('Login failed:', error);
      setUserInfo({ userInfo: undefined, isLogin: false });
    }
  };

  const onSignUp = () => {
    hisyory.push(ROUTE_SIGN_UP);
  };

  useEffect(() => {
    const saveId = sessionStorage.getItem(COOKIE_SAVE_ID);

    if (saveId) {
      setIsSaveId(true);
      form.setFieldValue('userid', saveId);
    }
  }, [form]);

  return (
    <>
      <StyledSignIn>
        <div className="signin-wrapper">
          <div className="signin-wrapper-header">
            <h2>로그인</h2>
            <p>Welcome back, you’ve been missed!</p>
          </div>
          <div className="signin-wrapper-body">
            {/* TODO: 구글, 카카오 로그인 연동 */}
            {/* <div className="signin-wrapper-body-top">
            <div className="signin-wrapper-body-top-left">
              <BasicButton
                disabled
                btnText="Log in with Google"
                icon={
                  <img
                    src="https://images.unsplash.com/photo-1700508317396-e343a69ac72f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHx8"
                    alt="kakao_icon"
                  />
                }
              />
            </div>
            <div className="signin-wrapper-body-top-right">
              <BasicButton
                disabled
                btnText="Log in with Kakao"
                icon={
                  <img
                    src="https://images.unsplash.com/photo-1700508317396-e343a69ac72f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHx8"
                    alt="kakao_icon"
                  />
                }
              />
            </div>
          </div>
          <div className="signin-wrapper-body-middle">
            <Divider />
            <p>OR</p>
            <Divider />
          </div> */}
            <div className="signin-wrapper-body-bottom">
              <Form
                className="signin-wrapper-body-bottom-form"
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

                <div className="signin-wrapper-body-bottom-form-forgot">
                  <div className="signin-wrapper-body-bottom-form-forgot-left">
                    <Form.Item name="save">
                      <Checkbox checked={isSaveId} onChange={onChangeSaveId}>
                        Remember me
                      </Checkbox>
                    </Form.Item>
                  </div>
                  <div className="signin-wrapper-body-bottom-form-forgot-right">
                    {/* <div
                      className="signin-wrapper-body-bottom-form-forgot-right-text"
                      onClick={onVisibleForgotPassword}
                    >
                      Forgot Password?
                    </div> */}
                  </div>
                </div>

                <div className="signin-wrapper-body-bottom-form-btns">
                  <div className="signin-wrapper-body-bottom-form-btns-submit">
                    <BasicButton btnText="Sign In" htmlType="submit" />
                  </div>
                  <div className="signin-wrapper-body-bottom-form-btns-signup">
                    <p>
                      You haven't any account?{' '}
                      <span onClick={onSignUp}>Sign Up</span>
                    </p>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </StyledSignIn>

      {/* 비밀번호 찾기 */}
      {/* <PasswordModal
        open={isForgotPassword}
        onClose={onChangePasswordVisible}
        onSubmit={(values) => console.log(values)}
        okButtonProps={{
          htmlType: 'submit'
        }}
        cancelButtonProps={{
          onClick: onChangePasswordVisible
        }}
      /> */}
    </>
  );
};
