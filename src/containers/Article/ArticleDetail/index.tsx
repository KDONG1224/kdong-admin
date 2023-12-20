// base
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';

// styles
import { StyledArticleDetail } from './style';

// components
import {
  BasicButton,
  BasicTag,
  BasicTextEditor,
  ThumbnailModal
} from 'components';

// modules
import {
  ArticleApi,
  QUERY_CREATE_ARTICLE,
  QUERY_GET_ARTICLE_BY_ID,
  ArticleDetailStateProps,
  ArticleThumbnaiProps
} from 'modules/article';
import {
  CategoryApi,
  CategoryListsProps,
  QUERY_GET_SUB_CATEGORY,
  ResponseSubCategoryLists
} from 'modules/category';
import { UploadApi } from 'modules/upload';
import { loadingState } from 'modules/ui';
import { PRcFile } from 'modules';

// libraries
import { AxiosError } from 'axios';
import { useSetRecoilState } from 'recoil';
import { Color } from 'antd/es/color-picker';
import { ColorPicker, Input, Select, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const ArticleDetail = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [editorData, setEditorData] = useState('');
  const [category, setCategory] = useState<CategoryListsProps | null>(null);
  const [tags, setTags] = useState<string[]>(['KDONG']);
  const [isThumbModal, setIsThumbModal] = useState(false);
  const [mainColor, setMainColor] = useState<string>('#000000');
  const [subColor, setSubColor] = useState<string>('#f43f00');
  const [hasThumbIds, setHasThumbIds] = useState<string[]>([]);
  const [hasTagIds, setHasTagIds] = useState<string[]>([]);
  const [thumbnailLists, setThumbnailLists] = useState<
    ArticleThumbnaiProps[] | PRcFile[]
  >([]);

  const setLoading = useSetRecoilState(loadingState);

  const queryClient = useQueryClient();
  const history = useHistory();
  const locationState = history.location.state as ArticleDetailStateProps;

  const articleApi = useMemo(() => {
    return new ArticleApi();
  }, []);

  const categoryApi = useMemo(() => {
    return new CategoryApi();
  }, []);

  const uploadApi = useMemo(() => {
    return new UploadApi();
  }, []);

  const { data: articleDetail, isFetching } = useQuery(
    [QUERY_GET_ARTICLE_BY_ID, isEdit],
    async () => {
      if (!locationState || !isEdit) return null;

      return await articleApi.getArticleById(locationState.articleId as string);
    },
    {
      select: (data) => {
        if (!data) return;

        return data.result;
      },
      refetchOnWindowFocus: false,
      retry: false
    }
  );

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
      refetchOnWindowFocus: false
    }
  );

  const { mutateAsync, isLoading } = useMutation(
    async (data: any) => {
      if (isEdit) {
        if (!locationState) return null;

        return await articleApi.updateArticleById(
          locationState.articleId as string,
          data
        );
      } else {
        return await articleApi.createArticle(data);
      }
    },
    {
      onSuccess: () => {
        history.goBack();

        return queryClient.invalidateQueries([QUERY_CREATE_ARTICLE]);
      },
      onMutate: async () => {
        const previousData = queryClient.getQueryData([QUERY_CREATE_ARTICLE]);
        await queryClient.cancelQueries([QUERY_CREATE_ARTICLE]);

        return { previousData };
      },

      onError: (data, values, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            [QUERY_CREATE_ARTICLE],
            context.previousData
          );
        }

        return;
      },
      onSettled: () => {
        return queryClient.invalidateQueries([QUERY_CREATE_ARTICLE]);
      }
    }
  );

  const onInitValues = useCallback(async () => {
    try {
      if (!articleDetail) return;

      const { title, content, tags, thumbnails, mainColor, subColor } =
        articleDetail;

      const thumbIds = thumbnails.map((item: any) => item.id);
      const tagIds = tags.map((item: any) => item.id);
      const tagsArr = tags.length > 0 ? tags.map((tag: any) => tag.name) : [];

      const res = await Promise.all(
        thumbnails.map(async (item: any, idx: number) => {
          const fileKey = item.location.replace(
            'https://kdong.s3.amazonaws.com/dev/',
            ''
          );
          const file = await uploadApi.getFileObject(fileKey);

          const object = new File([file], item.originalname, {
            type: item.mimetype
          });

          return {
            object,
            ...item
          };
        })
      );

      if (categories) {
        if (!articleDetail) return;

        const category = categories.find(
          (r) => r && r.id === articleDetail.category?.id
        );

        setCategory(category ? category : null);
      }

      setThumbnailLists(res);

      setTitle(title);
      setEditorData(content);
      setTags(tagsArr);
      setMainColor(mainColor);
      setSubColor(subColor);
      setHasThumbIds(thumbIds);
      setHasTagIds(tagIds);
    } catch (error) {
      console.log(error);
    }
  }, [articleDetail, categories, uploadApi]);

  const onChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const onChangeCategory = (option: CategoryListsProps) => {
    setCategory(option);
  };

  const onChangeEditorData = (content: string) => {
    setEditorData(content);
  };

  const onChangeTags = (values: string[]) => {
    setTags(values);
  };

  const onChangeMainColor = (color: string) => {
    setMainColor(color);
  };

  const onChangeSubColor = (color: string) => {
    setSubColor(color);
  };

  const onVisibleThumbModal = () => {
    setIsThumbModal((prev) => !prev);
  };

  const onChangeUploadFile = (info: any) => {
    const file = info.file;
    const blob = new Blob([file.originFileObj], {
      type: file.type
    });
    const blobUrl = URL.createObjectURL(blob);

    const lastItem = thumbnailLists[thumbnailLists.length - 1];

    const newFile = {
      ...file,
      sequence: lastItem ? lastItem.sequence + 1 : 1,
      originalname: file.name,
      mimetype: file.type,
      location: blobUrl
    };

    setThumbnailLists([...thumbnailLists, newFile]);
  };

  const onRemoveUploadFile = (index: Key) => {
    const images = (thumbnailLists as ArticleThumbnaiProps[]).filter(
      (_, idx) => idx !== index
    );

    setThumbnailLists(images);
  };

  const onOkUploadThumbnail = () => {
    onVisibleThumbModal();
  };

  const onClickSave = async () => {
    try {
      const formData = new FormData();

      if (thumbnailLists.length > 0) {
        thumbnailLists.forEach((list: any) => {
          console.log('== list == : ', list);
          if (list.originFileObj) {
            formData.append('thumbnails', list.originFileObj);
          } else {
            formData.append('thumbnails', list.file);
          }
        });
      }

      if (category) {
        formData.append('category', category.id);
      }

      if (isEdit) {
        if (hasThumbIds) {
          formData.append('hasThumbIds', hasThumbIds.join(',') as any);
        }

        if (hasTagIds) {
          formData.append('hasTagIds', hasTagIds.join(',') as any);
        }
      }

      formData.append('title', title);
      formData.append('content', editorData);
      formData.append('tags', tags.join(','));
      formData.append('mainColor', mainColor);
      formData.append('subColor', subColor);

      await mutateAsync(formData);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (locationState && locationState.articleId) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [locationState]);

  useEffect(() => {
    if (isEdit) {
      if (thumbnailLists) {
        setModalTitle('썸네일 보기');
      } else {
        setModalTitle('썸네일 추가');
      }
    } else {
      if (thumbnailLists.length > 0) {
        setModalTitle('썸네일 보기');
      } else {
        setModalTitle('썸네일 추가');
      }
    }
  }, [isEdit, thumbnailLists]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    onInitValues();
  }, [onInitValues]);

  return (
    <>
      <StyledArticleDetail>
        <div className="detail-wrapper">
          <div className="detail-wrapper-default">
            <div className="detail-wrapper-default-category">
              <Select
                placeholder="카테고리를 선택해주세요."
                value={category?.categoryName}
                options={
                  categories
                    ? categories.map((category) => ({
                        ...category,
                        label: category.categoryName,
                        value: category.categoryName
                      }))
                    : []
                }
                onChange={(_, option) =>
                  onChangeCategory(option as CategoryListsProps)
                }
              />
              <ColorPicker
                value={mainColor}
                panelRender={(panel) => (
                  <div className="custom-panel">
                    <div
                      style={{
                        fontSize: 12,
                        color: 'rgba(0, 0, 0, 0.88)',
                        lineHeight: '20px',
                        marginBottom: 8
                      }}
                    >
                      Main Color Picker
                    </div>
                    {panel}
                  </div>
                )}
                onChange={(value: Color, hex: string) => onChangeMainColor(hex)}
              />

              <ColorPicker
                value={subColor}
                panelRender={(panel) => (
                  <div className="custom-panel">
                    <div
                      style={{
                        fontSize: 12,
                        color: 'rgba(0, 0, 0, 0.88)',
                        lineHeight: '20px',
                        marginBottom: 8
                      }}
                    >
                      Sub Color Picker
                    </div>
                    {panel}
                  </div>
                )}
                onChange={(value: Color, hex: string) => onChangeSubColor(hex)}
              />
            </div>
            <div className="detail-wrapper-default-btns">
              <BasicButton btnText={modalTitle} onClick={onVisibleThumbModal} />
              <BasicButton
                btnText={isEdit ? '수정' : '저장'}
                onClick={onClickSave}
              />
            </div>
          </div>
          <div className="detail-wrapper-top">
            <Input.TextArea
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={onChangeTitle}
            />
          </div>
          <div className="detail-wrapper-body">
            <BasicTextEditor
              isEdit={isEdit}
              editorData={editorData}
              onChangeEditorData={onChangeEditorData}
            />
          </div>
          <div className="detail-wrapper-footer">
            <BasicTag tags={tags} onChangeTags={onChangeTags} />
          </div>
        </div>
      </StyledArticleDetail>

      <ThumbnailModal
        modalTitle={modalTitle}
        open={isThumbModal}
        onCancel={onVisibleThumbModal}
        okText={`${thumbnailLists ? '썸네일 변경' : '썸네일 추가'}`}
        isLoading={isFetching}
        isEdit={isEdit}
        onChangeUploadFile={onChangeUploadFile}
        onRemoveUploadFile={onRemoveUploadFile}
        onOk={onOkUploadThumbnail}
        thumbnailLists={thumbnailLists}
        setThumbnailLists={setThumbnailLists}
      />
    </>
  );
};
