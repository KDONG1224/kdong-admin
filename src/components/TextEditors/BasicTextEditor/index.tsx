// base
import React, { useEffect, useMemo } from 'react';

// styles
import { StyledBasicTextEditor } from './style';

// modules
import { QUERY_POST_UPLOAD_FILE, UploadApi } from 'modules/upload';

// hooks
import { useTargetScroll } from 'hooks';

// libraries
import hljs from 'highlight.js';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface BasicTextEditorProps {
  isRead: boolean;
  isEdit: boolean;
  editorData: string;
  onChangeEditorData: (content: string) => void;
}

export const BasicTextEditor: React.FC<BasicTextEditorProps> = ({
  isRead,
  isEdit,
  editorData,
  onChangeEditorData
}) => {
  const queryClient = useQueryClient();

  const { scrollY } = useTargetScroll({ y: 500, target: '.main-wrapper' });

  const uploadApi = useMemo(() => {
    return new UploadApi();
  }, []);

  const { mutateAsync } = useMutation(
    async (data: FormData) => await uploadApi.postUploadFile(data),
    {
      onSuccess: () => {
        return queryClient.invalidateQueries([QUERY_POST_UPLOAD_FILE]);
      },
      onMutate: async () => {
        const previousData = queryClient.getQueryData([QUERY_POST_UPLOAD_FILE]);
        await queryClient.cancelQueries([QUERY_POST_UPLOAD_FILE]);

        return { previousData };
      },

      onError: (data, values, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            [QUERY_POST_UPLOAD_FILE],
            context.previousData
          );
        }

        return;
      },
      onSettled: () => {
        return queryClient.invalidateQueries(['QUERY_POST_UPLOAD_FILE']);
      }
    }
  );

  const customUploadAdapter = (loader: any, uploadFunction: any) => {
    return {
      upload: async () => {
        return await loader.file.then(async (file: any) => {
          const formData = new FormData();
          formData.append('file', file);

          return await uploadFunction(formData).then((response: any) => ({
            default: response.result.location
          }));
        });
      }
    };
  };

  useEffect(() => {
    hljs.highlightAll();
  }, [isRead]);

  return (
    <StyledBasicTextEditor scrolly={scrollY}>
      {isRead ? (
        <div
          className="ck-editor__main"
          dangerouslySetInnerHTML={{ __html: editorData }}
        />
      ) : (
        <CKEditor
          editor={Editor}
          data={editorData}
          config={{
            toolbar: {
              items: [
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                'bulletedList',
                'numberedList',
                '|',
                'alignment',
                'outdent',
                'indent',
                '|',
                'fontBackgroundColor',
                'fontColor',
                'fontSize',
                '|',
                'blockQuote',
                'code',
                'codeBlock',
                '|',
                'link',
                'imageUpload',
                'insertTable',
                '|',
                'highlight',
                'horizontalLine',
                'pageBreak',
                'undo',
                'redo'
              ]
            },
            language: 'ko',
            // image: {
            //   toolbar: [
            //     'imageTextAlternative',
            //     'toggleImageCaption',
            //     'imageStyle:inline',
            //     'imageStyle:block',
            //     'imageStyle:side'
            //   ]
            // },
            image: {
              // styles: ['alignCenter', 'alignLeft', 'alignRight'],
              resizeOptions: [
                {
                  name: 'resizeImage:original',
                  label: 'Default image width',
                  value: null
                },
                {
                  name: 'resizeImage:50',
                  label: '50% page width',
                  value: '50'
                },
                {
                  name: 'resizeImage:75',
                  label: '75% page width',
                  value: '75'
                }
              ],
              toolbar: [
                'imageTextAlternative',
                'toggleImageCaption',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                'imageStyle:side',
                '|',
                'resizeImage'
              ]
            },
            table: {
              contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableCellProperties',
                'tableProperties'
              ]
            },
            codeBlock: {
              languages: [
                { language: 'plaintext', label: 'Plain text' },
                { language: 'css', label: 'CSS', class: 'language-css' },
                { language: 'html', label: 'HTML', class: 'language-html' },
                {
                  language: 'javascript',
                  label: 'JavaScript',
                  class: 'language-js language-javascript'
                },
                { language: 'typescript', label: 'TypeScript' }
              ]
            },
            heading: {
              options: [
                {
                  model: 'heading1',
                  view: 'h2',
                  title: 'Heading 1',
                  class: 'ck-heading_heading1'
                },
                {
                  model: 'heading2',
                  view: 'h3',
                  title: 'Heading 2',
                  class: 'ck-heading_heading2'
                },
                {
                  model: 'heading3',
                  view: 'h4',
                  title: 'Heading 3',
                  class: 'ck-heading_heading3'
                },
                {
                  model: 'heading4',
                  view: 'h5',
                  title: 'Heading 4',
                  class: 'ck-heading_heading4'
                },
                {
                  model: 'paragraph',
                  title: 'Paragraph',
                  class: 'ck-heading_paragraph'
                }
              ]
            },
            fontSize: {
              options: [14, '20', '24']
            },
            extraPlugins: [
              function (editor) {
                editor.plugins.get('FileRepository').createUploadAdapter = (
                  loader
                ) => {
                  return customUploadAdapter(loader, mutateAsync);
                };
              }
            ]
          }}
          onReady={(editor) => console.log('Editor is ready to use!', editor)}
          onError={(error) => console.log(error)}
          onChange={(event, editor) => {
            const data = editor.getData();

            onChangeEditorData(data);
          }}
        />
      )}
    </StyledBasicTextEditor>
  );
};
