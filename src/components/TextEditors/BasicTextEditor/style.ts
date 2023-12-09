import styled from 'styled-components';

interface StyledBasicTextEditorProps {
  scrollY: number;
}

export const StyledBasicTextEditor = styled.div<StyledBasicTextEditorProps>`
  .ck-toolbar {
    border: none !important;
    border-radius: 0 !important;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: none !important;

    &.ck-focused {
      border: none !important;
      border-radius: 0 !important;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      box-shadow: none !important;
    }
  }

  .ck-editor__main {
    height: ${({ scrollY }) => `${scrollY}px`};

    .ck-content {
      height: ${({ scrollY }) => `${scrollY}px`};
      border: none !important;
      border-radius: 0 !important;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      box-shadow: none !important;

      &.ck-focused {
        border: none !important;
        border-radius: 0 !important;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        box-shadow: none !important;
      }

      h1 {
        &.ck-placeholder {
          display: none !important;
        }
      }

      h1,
      h2,
      h3,
      h4 {
        font-weight: normal;
        letter-spacing: -1px;
        color: #000;
        margin: 1em 0 20px;
      }

      > h2 {
        font-size: 2.62em;
        line-height: 1.46;
      }

      > h3 {
        font-size: 2.44em;
        line-height: 1.48;
      }

      > h4 {
        font-size: 2.25em;
        line-height: 1.55;
      }

      > p {
        font-size: 1.25em;
        line-height: 1.75;
      }
    }
  }
`;
