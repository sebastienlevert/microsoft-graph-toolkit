import * as React from 'react';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { Agenda, Get } from '@microsoft/mgt-react';
import { Loading } from '../components/Loading';
import {
  shorthands,
  makeStyles,
  mergeClasses,
  Button,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions
} from '@fluentui/react-components';
import { Chat as GraphChat } from '@microsoft/microsoft-graph-types';
import { Chat, NewChat } from '@microsoft/mgt-chat';
import ChatListTemplate from './Chats/ChatListTemplate';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  panels: {
    ...shorthands.padding('10px')
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: '300px',
    minWidth: '300px',
    ...shorthands.overflow('auto'),
    maxHeight: '80vh',
    borderRightColor: 'var(--neutral-stroke-rest)',
    borderRightStyle: 'solid',
    borderRightWidth: '1px'
  },
  side: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: '80%',
    ...shorthands.overflow('auto'),
    maxHeight: '80vh',
    height: '100%'
  },
  newChat: {
    paddingBottom: '10px',
    marginRight: '0px',
    marginLeft: 'auto'
  },
  dialog: {
    display: 'block'
  }
});

export const ChatPage: React.FunctionComponent = () => {
  const styles = useStyles();
  const [selectedChat, setSelectedChat] = React.useState<GraphChat>();
  const [isNewChatOpen, setIsNewChatOpen] = React.useState(false);

  const chatSelected = React.useCallback(
    (e: GraphChat) => {
      if (isNewChatOpen) {
        setIsNewChatOpen(false);
      }
      setSelectedChat(e);
    },
    [isNewChatOpen, setSelectedChat, setIsNewChatOpen]
  );

  return (
    <>
      <PageHeader
        title={'Chats'}
        description={'Stay in touch with your teammates and navigate your chats'}
      ></PageHeader>

      <div className={styles.container}>
        <div className={mergeClasses(styles.panels, styles.main)}>
          <div className={styles.newChat}>
            <Dialog
              open={isNewChatOpen}
              onOpenChange={(event, data) => {
                setIsNewChatOpen(data.open);
              }}
            >
              <DialogTrigger disableButtonEnhancement>
                <Button>New Chat</Button>
              </DialogTrigger>
              <DialogSurface>
                <DialogBody className={styles.dialog}>
                  <DialogTitle>New Chat</DialogTitle>
                  <NewChat
                    onChatCreated={chatSelected}
                    onCancelClicked={() => {
                      setIsNewChatOpen(false);
                    }}
                  ></NewChat>
                </DialogBody>
              </DialogSurface>
            </Dialog>
          </div>
          <ChatList chatSelected={selectedChat} onChatSelected={chatSelected}></ChatList>
        </div>
        <div className={styles.side}>{selectedChat && <Chat chatId={selectedChat.id!}></Chat>}</div>
      </div>
    </>
  );
};

interface ChatListProps {
  onChatSelected: (e: GraphChat) => void;
  chatSelected: GraphChat | undefined;
}

const ChatList = (props: ChatListProps) => {
  const getPreviousDate = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString();
  };

  return (
    <Get
      resource={`me/chats?$expand=members,lastMessagePreview&$orderBy=lastMessagePreview/createdDateTime desc&$filter=viewpoint/lastMessageReadDateTime ge ${getPreviousDate(
        9
      )}`}
      scopes={['chat.read']}
      cacheEnabled={true}
    >
      <ChatListTemplate
        template="default"
        onSelected={props.onChatSelected}
        selectedChat={props.chatSelected}
      ></ChatListTemplate>
      <Loading template="loading" message={'Loading your chats...'}></Loading>
    </Get>
  );
};
