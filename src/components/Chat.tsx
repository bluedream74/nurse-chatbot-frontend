import { useState, useRef, useEffect } from 'react'
import { ChangeEvent, KeyboardEvent  } from 'react'
import clsx from 'clsx';
// import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
// import Typography from '@mui/material/Typography';
import {EmojiEmotionsSharp} from '@mui/icons-material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import SendIcon from '@mui/icons-material/Send'
import { styled } from '@mui/material/styles'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getChatgptResponse, ChatType } from '../store/chatSlice'

const StyledMessageRow = styled('div')(() => ({
  '&.bot': {
    '& .bubble': {
      backgroundColor: '#818cf8',
      color: '#ffffff',
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      '& .time': {
        marginLeft: 12,
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopLeftRadius: 20,
      },
    },
    '&.last-of-group': {
      '& .bubble': {
        borderBottomLeftRadius: 20,
      },
    },
  },
  '&.me': {
    paddingLeft: 40,

    '& .bubble': {
      marginLeft: 'auto',
      backgroundColor: '#64748b',
      color: '#ffffff',
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      '& .time': {
        justifyContent: 'flex-end',
        right: 0,
        marginRight: 12,
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopRightRadius: 20,
      },
    },

    '&.last-of-group': {
      '& .bubble': {
        borderBottomRightRadius: 20,
      },
    },
  },
  '&.bot + .me, &.me + .bot': {
    paddingTop: 20,
    marginTop: 20,
  },
  '&.first-of-group': {
    '& .bubble': {
      borderTopLeftRadius: 20,
      paddingTop: 13,
    },
  },
  '&.last-of-group': {
    '& .bubble': {
      borderBottomLeftRadius: 20,
      paddingBottom: 13,
      '& .time': {
        display: 'flex',
      },
    },
  },
}))

const Chat = () => {
  const dispatch = useAppDispatch()

  const [messageText, setMessageText] = useState('')

  const chats = useAppSelector((state) => state.chat.chats)

  const status = useAppSelector((state) => state.chat.status)

  const chatRef = useRef(null);

  const onInputChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    setMessageText(ev.target.value)
  }

  const handleKeyDown = (ev: KeyboardEvent<HTMLInputElement>): void => {
    if(status === "loading") return;
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault()
      if(ev.currentTarget.value == "") return;
      setMessageText(ev.currentTarget.value)
      submitPrompt()
    }
  }

  const submitPrompt = (): void => {
    dispatch(getChatgptResponse(messageText))
    setMessageText("")
  }

  const isFirstMessageOfGroup = (item: ChatType, i: number): boolean => {
    return i === 0 || (chats[i - 1] && chats[i - 1].type !== item.type);
  }

  function isLastMessageOfGroup(item: ChatType, i: number): boolean {
    return i === chats.length - 1 || (chats[i + 1] && chats[i + 1].type !== item.type);
  }

  useEffect(() => {
    // chatRef.current?
  }, [chats]);

  return (
    <div ref={chatRef}>
      <Box
        className="flex flex-col h-screen w-full pt-4 px-4 pb-10 overflow-y-scroll"
        sx={{
          backgroundColor: '#b3b3b3',
        }}
      >
        {chats.map((item, i) => {
          return (
            <StyledMessageRow
              key={i}
              className={clsx(
                'flex flex-col grow-0 shrink-0 items-start justify-end relative px-4 pb-1',
                item.type,
                { 'first-of-group': isFirstMessageOfGroup(item, i) },
                { 'last-of-group': isLastMessageOfGroup(item, i) },
                i + 1 === chats.length && 'pb-24'
              )}
            >
              <div className="bubble flex relative items-center justify-center p-3 max-w-full">
                <div className="leading-tight whitespace-pre-wrap">{item.message}</div>
                {/* <Typography
                  className="time absolute hidden w-full text-11 mt-2 -mb-6 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
                  color="text.secondary"
                >
                  {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                </Typography> */}
              </div>
            </StyledMessageRow>
          );
        })}
      </Box>
      <Paper
        square
        className="absolute border-t-1 bottom-0 right-0 left-0 py-4 px-4"
        sx={{
          backgroundColor: '#e8e8e8'
        }}
      >
        <div className="flex items-center">
          <IconButton size="large">
            <EmojiEmotionsSharp />
          </IconButton>

          <IconButton size="large">
            <AttachFileIcon />
          </IconButton>

          <InputBase
            multiline
            maxRows={5}
            autoFocus={false}
            id="message-input"
            className="flex-1 flex grow shrink-0 mx-2 px-4 border-2 rounded-2xl"
            placeholder="Type your message"
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            value={messageText}
            sx={{ backgroundColor: 'background.paper', padding: '10px' }}
          />

          <IconButton 
            size="large"
            disabled={status === "loading" ? true : false}
            onClick={submitPrompt}
          >
            <SendIcon/>
          </IconButton>
        </div>
      </Paper>
    </div>
  )
}

export default Chat
