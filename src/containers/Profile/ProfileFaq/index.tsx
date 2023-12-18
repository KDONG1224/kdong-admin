import React, { useEffect, useMemo, useState } from 'react';
import { StyledProfileFaq } from './style';
import { BasicButton, DragSortTable, FaqEditModal } from 'components';
import { changeKorFaqType } from 'consts';
import { DragEndEvent } from '@dnd-kit/core';
import {
  FaqListsProps,
  ProfileApi,
  QUERY_PROFILE_FAQ,
  QUERY_PROFILE_FAQ_CREATE,
  QUERY_PROFILE_FAQ_EXPOSE,
  RequestProfileFaqFormProps,
  ResponseProfileFaqProps
} from 'modules/profile';
import { Switch, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * 추후 작업 해야 할 내용
 * 1) faqType에 따른 분류
 * 2) pagination
 */
export const ProfileFaq = () => {
  const [faqLists, setFaqLists] = useState<FaqListsProps[]>();
  const [editFaq, setEditFaq] = useState<FaqListsProps | undefined>(undefined);
  const [showContentModal, setShowContentModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const faqApi = useMemo(() => {
    return new ProfileApi();
  }, []);

  const { data: resultFaqLists } = useQuery<
    ResponseProfileFaqProps,
    AxiosError,
    FaqListsProps[]
  >(
    [QUERY_PROFILE_FAQ],
    async () => {
      return await faqApi.getProfileFaq();
    },
    {
      select: (res) => {
        return res.result.faqLists;
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const { mutateAsync } = useMutation(
    [QUERY_PROFILE_FAQ_CREATE],
    async (values: RequestProfileFaqFormProps) => {
      if (editFaq) {
        return await faqApi.updateProfileFaq(editFaq.id, values);
      } else {
        return await faqApi.createProfileFaq(values);
      }
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries([QUERY_PROFILE_FAQ]);
      }
    }
  );

  const { mutateAsync: changeExpose } = useMutation(
    [QUERY_PROFILE_FAQ_EXPOSE],
    async () => {
      return await faqApi.updateExposeProfileFaq(editFaq?.id as string, {
        expose: !editFaq?.expose as boolean
      });
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries([QUERY_PROFILE_FAQ]);
      },
      onError: (error) => {
        return queryClient.cancelQueries([
          QUERY_PROFILE_FAQ_EXPOSE,
          QUERY_PROFILE_FAQ
        ]);
      }
    }
  );

  const columns = useMemo(() => {
    return [
      // {
      //   key: 'sort'
      // },
      // {
      //   title: '순서',
      //   dataIndex: 'sequence'
      // },
      {
        title: '분류',
        dataIndex: 'faqType',
        key: 'faqType',
        width: '10%',
        render: (_: string, recode: FaqListsProps) => {
          return changeKorFaqType(recode.faqType);
        }
      },
      {
        title: '질문',
        dataIndex: 'question',
        key: 'question',
        width: '30%'
      },
      {
        title: '답변',
        dataIndex: 'answer',
        key: 'answer',
        width: '40%'
      },
      {
        key: 'expose',
        dataIndex: 'expose',
        title: '노출여부',
        render: (text: boolean, record: FaqListsProps) => (
          <Switch
            checked={text}
            onChange={() => {
              setEditFaq(record);
              onChangeExpose();
            }}
          />
        )
      },
      {
        title: '수정하기',
        dataIndex: 'seq',
        key: 'seq',
        width: '10%',
        render: (_: null, recode: FaqListsProps) => (
          <BasicButton
            btnText="수정"
            onClick={() => {
              setEditFaq(recode);
              onVisibleContentModal();
            }}
          />
        )
      }
    ];
  }, []);

  const dataSource = useMemo(() => {
    if (!faqLists) return [];

    return faqLists;
  }, [faqLists]);

  const onVisibleContentModal = () => {
    setShowContentModal((prev) => !prev);
  };

  const onCreateFaq = () => {
    setEditFaq(undefined);
    onVisibleContentModal();
  };

  const onChangeSequence = (values: FaqListsProps[]) => {
    // const newValues = values.map((item: FaqListsProps, idx: number) => ({
    //   ...item,
    //   sequence: idx + 1
    // }));

    setFaqLists(values);
  };

  const onFinish = async (values: RequestProfileFaqFormProps) => {
    try {
      await mutateAsync(values);
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const onChangeExpose = async () => {
    try {
      await changeExpose();
    } catch (e: any) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    if (!resultFaqLists) return;

    setFaqLists(resultFaqLists);
  }, [resultFaqLists]);

  return (
    <>
      <StyledProfileFaq>
        <div className="faq-wrapper">
          <div className="faq-wrapper-top">
            <BasicButton btnText="신규등록" onClick={onCreateFaq} />
          </div>
          <div className="faq-wrapper-body">
            <DragSortTable
              columns={columns}
              dataSource={dataSource}
              setSequence={onChangeSequence}
              onDragEnd={(e: DragEndEvent) => console.log(e)}
              pagination={false}
            />
          </div>
        </div>
      </StyledProfileFaq>

      <FaqEditModal
        open={showContentModal}
        data={editFaq}
        onClose={onVisibleContentModal}
        onSubmit={onFinish}
      />
    </>
  );
};
