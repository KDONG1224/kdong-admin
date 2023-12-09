declare module 'react-html-parser';
declare module '@ckeditor/ckeditor5-horizontal-line';
declare module '@ckeditor/ckeditor5-page-break';
declare module '@ckeditor/ckeditor5-show-blocks';

declare module '@ckeditor/ckeditor5-heading/heading' {
  interface HeadingParagraphOption {
    model:
      | 'paragraph'
      | 'paragraph1'
      | 'paragraph2'
      | 'paragraph3'
      | 'paragraph4'
      | 'paragraph5'
      | 'paragraph6';
  }
}
