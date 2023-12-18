// base
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// style
import {
  StyledAddImageWrap,
  StyledCloseOutlined,
  StyledPlusOutlined,
  StyledProfileBanner
} from './style';

// components
import { BasicButton, LazyImage } from 'components';

// modules
import {
  BannerImageProps,
  BannerListsProps,
  BannerTitleProps,
  ProfileApi,
  QUERY_GET_PROFILE,
  QUERY_UPDATE_PROFILE,
  RequestProfileBannerUpdate,
  ResponseProfileProps
} from 'modules/profile';
import { uploadApi } from 'modules/upload';

// libraries
import { AxiosError } from 'axios';
import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Row,
  Slider,
  Upload,
  message
} from 'antd';
import { RcFile } from 'antd/es/upload';
import { useForm } from 'antd/es/form/Form';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { loadingState } from 'modules/ui';

interface PRcFile extends RcFile {
  sequence: number;
  originalname: string;
  mimetype: string;
  location: string;
  id: string | null;
}

export const ProfileBanner = () => {
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [bannerThumbLists, setBannerThumbLists] = useState<
    BannerImageProps[] | PRcFile[]
  >([]);
  const [initialValues, setInitialValues] = useState<BannerListsProps>();
  const [hasThumbIds, setHasThumbIds] = useState<string[]>([]);

  const setLoading = useSetRecoilState(loadingState);

  const [form] = useForm();
  const queryClient = useQueryClient();

  const profileApi = useMemo(() => {
    return new ProfileApi();
  }, []);

  const { data: bannerLists, isLoading } = useQuery<
    ResponseProfileProps,
    AxiosError,
    BannerListsProps
  >(
    [QUERY_GET_PROFILE],
    async () => {
      return await profileApi.getProfileBanners();
    },
    {
      select: (res) => {
        return res.result.bannerLists[0];
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const { mutateAsync: updateBanner } = useMutation(
    [QUERY_UPDATE_PROFILE],
    async (data: FormData) => {
      return await profileApi.updateProfileBanners(
        bannerLists?.id as string,
        data
      );
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries([QUERY_GET_PROFILE]);
      }
    }
  );

  const onInitValues = useCallback(async () => {
    try {
      if (!bannerLists) return;

      const { autoPlay, playSpeed, bannerImages } = bannerLists;
      const ids = bannerImages.map((item) => item.id);

      const res = await Promise.all(
        bannerImages.map(async (item: any, idx: number) => {
          const file = await uploadApi.getS3Object(
            item.location,
            item.originalname,
            item.mimetype
          );

          return {
            file,
            ...item
          };
        })
      );

      form.setFieldsValue({ ...bannerLists });
      setInitialValues({ ...bannerLists });
      setPlaySpeed(playSpeed);
      setAutoPlay(autoPlay);
      setHasThumbIds(ids);
      setBannerThumbLists(res);
    } catch (e) {
      console.log(e);
    }
  }, [form, bannerLists]);

  const handleSetSpeed = (value: number) => {
    setPlaySpeed(value);
  };

  const handleSetAutoPlay = (checked: boolean) => {
    setAutoPlay(checked);
  };

  const handleSetTitleSpeed = (key: number, speed: number) => {
    const bannerTitles = form.getFieldValue(
      'bannerTitles'
    ) as BannerTitleProps[];

    const updatedTitles = bannerTitles
      .map((title, idx) =>
        idx === key ? { ...title, playSpeed: speed } : title
      )
      .sort((a, b) => a.sequence - b.sequence);

    form.setFieldsValue({ bannerTitles: updatedTitles });
  };

  const handleRemoveTitle = (
    name: number,
    remove: (index: number | number[]) => void
  ) => {
    remove(name);

    const bannerTitles = form.getFieldValue(
      'bannerTitles'
    ) as BannerTitleProps[];

    form.setFieldsValue({
      bannerTitles: bannerTitles.map((list, idx) => ({
        ...list,
        sequence: idx + 1
      }))
    });
  };

  const handleUpload = (info: any) => {
    if (info.file.status === 'error') {
      return false;
    }

    const file = info.file;
    const blob = new Blob([file.originFileObj], {
      type: file.type
    });
    const blobUrl = URL.createObjectURL(blob);

    const lastItem = bannerThumbLists[bannerThumbLists.length - 1];

    const newFile = {
      ...file,
      sequence: lastItem ? lastItem.sequence + 1 : 1,
      originalname: file.name,
      mimetype: file.type,
      location: blobUrl
    };

    setBannerThumbLists([...bannerThumbLists, newFile]);
  };

  const handleRemove = (id: string, index: number) => {
    const bannerImages = (bannerThumbLists as BannerImageProps[]).filter(
      (_, idx) => idx !== index
    );

    setBannerThumbLists(bannerImages);
  };

  const beforeUpload = (file: RcFile) => {
    if (file.size > 10000000) {
      console.log('파일당 10MB를 초과할 수 없습니다.');

      return false;
    }

    return true;
  };

  const onFinish = async (values: RequestProfileBannerUpdate) => {
    try {
      const formData = new FormData();

      if (bannerThumbLists.length > 0) {
        bannerThumbLists.forEach((list: any) => {
          if (list.originFileObj) {
            formData.append('thumbnails', list.originFileObj);
          } else {
            formData.append('thumbnails', list.file);
          }
        });
      }

      formData.append('hasThumbIds', hasThumbIds.join(',') as any);

      formData.append('bannerTitles', JSON.stringify(values.bannerTitles));
      formData.append('playSpeed', values.playSpeed);
      formData.append('autoPlay', values.autoPlay);

      await updateBanner(formData);
    } catch (e: any) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    if (!bannerLists) return;

    onInitValues();
  }, [bannerLists, form, onInitValues]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return (
    <StyledProfileBanner>
      <div className="banner-wrapper">
        <Form
          form={form}
          onFinish={onFinish}
          className="banner-wrapper-form"
          initialValues={initialValues}
        >
          <div className="banner-wrapper-btns">
            <BasicButton btnText="저장" htmlType="submit" />
          </div>
          <Row>
            <Col span={24}>
              <Descriptions size="small" column={24} layout="vertical" bordered>
                <Descriptions.Item
                  label="배너 타이틀"
                  span={24}
                  className="banner-wrapper-form-title"
                >
                  <Row align="middle">
                    <Col span={8}>
                      <p className="sub-title">타이틀</p>
                    </Col>
                    <Col span={16}>
                      <p className="sub-title">재생속도 (sec)</p>
                    </Col>
                  </Row>
                  <Form.List name="bannerTitles">
                    {(fields, { add, remove }) => {
                      const titleLists = fields.map((field, idx) => ({
                        ...field,
                        seq: idx + 1
                      }));

                      return (
                        <>
                          {titleLists.map(({ key, name, ...restField }) => (
                            <Row key={key}>
                              <Col span={8}>
                                <Form.Item
                                  name={[name, 'title']}
                                  {...restField}
                                >
                                  <Input placeholder="타이틀을 입력해주세요" />
                                </Form.Item>
                              </Col>
                              <Col span={14}>
                                <Form.Item
                                  name={[name, 'playSpeed']}
                                  {...restField}
                                >
                                  <div className="banner-title-speed-box">
                                    <Slider
                                      min={1}
                                      max={10}
                                      value={
                                        (form.getFieldValue('bannerTitles')[
                                          name
                                        ] &&
                                          form.getFieldValue('bannerTitles')[
                                            name
                                          ].playSpeed) ||
                                        0
                                      }
                                      onChange={(e) =>
                                        handleSetTitleSpeed(name, e as number)
                                      }
                                    />
                                    <InputNumber
                                      disabled
                                      style={{ margin: '0 16px' }}
                                      value={
                                        (form.getFieldValue('bannerTitles')[
                                          name
                                        ] &&
                                          form.getFieldValue('bannerTitles')[
                                            name
                                          ].playSpeed) ||
                                        0
                                      }
                                    />
                                  </div>
                                </Form.Item>
                              </Col>
                              <Col span={2}>
                                <div className="minus-icon">
                                  <MinusCircleOutlined
                                    onClick={() =>
                                      handleRemoveTitle(name, remove)
                                    }
                                    // @ts-ignore
                                  />
                                </div>
                              </Col>
                            </Row>
                          ))}
                          <Form.Item>
                            <Button
                              disabled={fields.length === 5}
                              onClick={() =>
                                add({
                                  title: '',
                                  playSpeed: 0,
                                  seq: fields.length + 1
                                })
                              }
                              block
                              icon={<PlusOutlined />}
                              style={{ marginBottom: 10 }}
                            >
                              Add Title
                            </Button>
                          </Form.Item>
                        </>
                      );
                    }}
                  </Form.List>
                </Descriptions.Item>
                <Descriptions.Item
                  label="배너 구성"
                  span={24}
                  className="image"
                >
                  <div className="image-lists">
                    {bannerThumbLists.map((list, idx) => (
                      <div className="image-lists-box" key={list.sequence}>
                        <LazyImage src={list.location} alt="upload_image" />
                        <StyledCloseOutlined
                          onClick={() => handleRemove(list.id as string, idx)}
                        />
                      </div>
                    ))}
                  </div>
                  {bannerThumbLists.length < 5 && (
                    <Upload
                      listType="picture"
                      showUploadList={false}
                      maxCount={5}
                      beforeUpload={beforeUpload}
                      onChange={handleUpload}
                      customRequest={() => true}
                    >
                      <StyledAddImageWrap>
                        <StyledPlusOutlined />
                      </StyledAddImageWrap>
                    </Upload>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="배너 옵션">
                  <Row align="middle">
                    <Col span={16}>
                      <p className="sub-title">재생속도 (sec)</p>
                    </Col>
                    <Col span={8}>
                      <p className="sub-title">자동재생 (autoplay)</p>
                    </Col>
                    <Col span={10}>
                      <Form.Item name="playSpeed">
                        <Slider
                          min={1}
                          max={20}
                          onChange={(value) => handleSetSpeed(value as number)}
                          value={playSpeed}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name="playSpeed">
                        <InputNumber
                          min={1}
                          max={20}
                          style={{ margin: '0 16px' }}
                          onChange={(value) => handleSetSpeed(value as number)}
                          value={playSpeed}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item name="autoPlay">
                        <Checkbox
                          checked={autoPlay}
                          onChange={(value) =>
                            handleSetAutoPlay(value.target.checked)
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Form>
      </div>
    </StyledProfileBanner>
  );
};
