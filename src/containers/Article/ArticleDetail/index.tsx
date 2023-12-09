// base
import { useEffect, useMemo, useState } from 'react';
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

// libraries
import { Input, Select } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArticleApi,
  QUERY_CREATE_ARTICLE,
  QUERY_GET_ARTICLE_BY_ID
} from 'modules/article';
import { UploadFile } from 'antd/lib';
import { ArticleDetailStateProps } from 'modules/article/models/article.model';

/**
 * 1) 카테고리 선택 만들기 (front + backend)
 * 2) 썸네일 추가 + 보기 만들기 (modal) === 완료
 * 3) 저장 api 연동 === 완료
 * 4) 수정 api 연동
 * 5) 수정 시 데이터 불러오기 + 화면 렌더링
 */
export const ArticleDetail = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [editorData, setEditorData] = useState('');
  const [tags, setTags] = useState<string[]>(['KDONG']);
  const [thumbnail, setThumbnail] = useState<UploadFile[]>([]);
  const [isThumbModal, setIsThumbModal] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumnaillist, setThumnaillist] = useState<any[]>([]);

  const queryClient = useQueryClient();
  const history = useHistory();
  const locationState = history.location.state as ArticleDetailStateProps;

  const articleApi = useMemo(() => {
    return new ArticleApi();
  }, []);

  const { data, isLoading } = useQuery(
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
      onSuccess: (data) => {
        if (!data) return;

        const { title, content, tags, thumbnails } = data;

        const tagsArr =
          tags && tags.length > 0 ? tags.map((tag: any) => tag.tag) : [];

        setTitle(title);
        setEditorData(content);
        setTags(tagsArr);
        setThumnaillist(thumbnails);
      },
      refetchOnWindowFocus: false,
      retry: false
    }
  );

  const { mutateAsync } = useMutation(
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

  const onChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const onChangeEditorData = (content: string) => {
    setEditorData(content);
  };

  const onChangeTags = (values: string[]) => {
    setTags(values);
  };

  const onVisibleThumbModal = () => {
    setIsThumbModal((prev) => !prev);
  };

  const onChangeUploadFile = (file: UploadFile[], originFile: any[]) => {
    setThumbnail(file);
    setThumnaillist(originFile);
  };

  const onOkUploadThumbnail = () => {
    const newLists = thumnaillist.map((item, idx) => ({
      ...item,
      sequence: idx + 1
    }));

    setThumnaillist(newLists);
    onVisibleThumbModal();
  };

  const onClickSave = async () => {
    try {
      const formData = new FormData();

      thumbnail.forEach((file: any) => {
        formData.append('thumbnails', file.originFileObj);
      });

      formData.append('title', title);
      formData.append('content', editorData);
      formData.append('tags', tags.join(','));

      await mutateAsync(formData);
    } catch (error) {
      console.log(error);
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
      if (thumbnailUrl) {
        setModalTitle('썸네일 보기');
      } else {
        setModalTitle('썸네일 추가');
      }
    } else {
      if (thumbnail.length > 0) {
        setModalTitle('썸네일 보기');
      } else {
        setModalTitle('썸네일 추가');
      }
    }
  }, [isEdit, thumbnail, thumbnailUrl]);

  return (
    <>
      <StyledArticleDetail>
        <div className="detail-wrapper">
          <div className="detail-wrapper-default">
            <div className="detail-wrapper-default-category">
              <Select
                placeholder="카테고리를 선택해주세요."
                options={[
                  {
                    label: '카테고리 1번',
                    value: '1'
                  },
                  {
                    label: '카테고리 2번',
                    value: '2'
                  },
                  {
                    label: '카테고리 3번',
                    value: '3'
                  }
                ]}
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
        okText={`${thumbnail ? '썸네일 변경' : '썸네일 추가'}`}
        data={thumbnail}
        isLoading={isLoading}
        isEdit={isEdit}
        onChangeUploadFile={onChangeUploadFile}
        onOk={onOkUploadThumbnail}
        thumnaillist={thumnaillist}
        setThumnaillist={setThumnaillist}
      />
    </>
  );
};
