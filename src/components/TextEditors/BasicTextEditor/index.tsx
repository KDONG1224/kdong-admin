// base
import React from 'react';

// styles
import { StyledBasicTextEditor } from './style';

// modules
import { QUERY_POST_UPLOAD_FILE, uploadApi } from 'modules/upload';

// hooks
import { useTargetScroll } from 'hooks';

// libraries
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface BasicTextEditorProps {
  isEdit: boolean;
  editorData: string;
  onChangeEditorData: (content: string) => void;
}

export const BasicTextEditor: React.FC<BasicTextEditorProps> = ({
  isEdit,
  editorData,
  onChangeEditorData
}) => {
  const queryClient = useQueryClient();

  const { scrollY } = useTargetScroll({ y: 500, target: '.main-wrapper' });

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

  return (
    <StyledBasicTextEditor scrolly={scrollY}>
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
              { language: 'css', label: 'CSS' },
              { language: 'html', label: 'HTML' },
              { language: 'javascript', label: 'JavaScript' },
              { language: 'typescript', label: 'TypeScript' }
            ]
          },
          heading: {
            options: [
              {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1'
              },
              {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2'
              },
              {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3'
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

          console.log('== data == : ', data);

          onChangeEditorData(data);
        }}
      />
    </StyledBasicTextEditor>
  );
};
