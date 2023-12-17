import { BaseResponseProps } from 'modules/common';

export interface RequestWantedProps {
  clientName: string;
  clientEmail: string;
}

export interface WantedListsProps {
  clientName: string;
  clientEmail: string;
  eventDate: string;
  id: string;
  createdAt: string;
  updateAt: string;
  isSend: boolean;
}

export interface ResponseWantedProps extends BaseResponseProps {
  result: {
    wantedLists: WantedListsProps[];
  };
}

export interface SendMailerProps {
  sendIds: string;
}
