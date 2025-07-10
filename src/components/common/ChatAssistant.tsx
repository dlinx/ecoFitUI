import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Slide,
  useTheme,
  useMediaQuery,
  CircularProgress,
  keyframes,
  styled,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import chatService, { AvailableFilters } from '../../services/chat';
import { SearchParams } from '../../types';
import { useAlgoliaSearchWithFacets } from '../../hooks/useAlgolia';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
  products?: any[];
  filters?: Record<string, any>;
}

// Pulse animation for FAB
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

// Styled Components
const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 80,
  right: 24,
  width: 400,
  height: 500,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[12],
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    right: 16,
    width: 'calc(100vw - 32px)',
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const HeaderAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: 'rgba(255,255,255,0.2)',
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
}));

const MessageBubble = styled(Paper)<{ $isUser: boolean }>(({ theme, $isUser }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: $isUser ? theme.palette.primary.main : 'white',
  color: $isUser ? 'white' : theme.palette.text.primary,
  borderRadius: 8,
  boxShadow: $isUser ? theme.shadows[2] : theme.shadows[1],
  border: $isUser ? 'none' : `1px solid ${theme.palette.divider}`,
}));

const MessageTime = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const SuggestionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

const SuggestionChip = styled(Chip)(({ theme }) => ({
  cursor: 'pointer',
  fontSize: '0.75rem',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
    transform: 'translateY(-1px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const TypingIndicator = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: 'white',
  borderRadius: 8,
  boxShadow: theme.shadows[1],
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: 'white',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const SendButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    transform: 'scale(1.05)',
  },
  transition: 'transform 0.2s ease-in-out',
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  zIndex: 1001,
  boxShadow: theme.shadows[8],
  animation: `${pulse} 2s infinite`,
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[12],
  },
  transition: 'all 0.3s ease-in-out',
}));

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your EcoFit assistant. I can help you find sustainable fitness products, answer questions about our eco-friendly gear, or assist with your shopping experience. What can I help you with today?",
      sender: 'assistant',
      timestamp: new Date(),
      suggestions: [
        'Show me yoga mats',
        'Find eco-friendly activewear',
        'What makes your products sustainable?',
        'Help me choose workout shoes'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // Get current search parameters from URL
  const getCurrentSearchParams = (): SearchParams => {
    const urlParams = new URLSearchParams(location.search);
    const currentSearchParams: SearchParams = {};
    
    if (urlParams.get('q')) currentSearchParams.q = urlParams.get('q')!;
    if (urlParams.get('gender')) currentSearchParams.gender = urlParams.get('gender')!.split(',');
    if (urlParams.get('category')) currentSearchParams.category = urlParams.get('category')!.split(',');
    if (urlParams.get('subCategory')) currentSearchParams.subCategory = urlParams.get('subCategory')!.split(',');
    if (urlParams.get('color')) currentSearchParams.color = urlParams.get('color')!.split(',');
    if (urlParams.get('size')) currentSearchParams.size = urlParams.get('size')!.split(',');
    if (urlParams.get('minPrice')) currentSearchParams.minPrice = Number(urlParams.get('minPrice'));
    if (urlParams.get('maxPrice')) currentSearchParams.maxPrice = Number(urlParams.get('maxPrice'));

    return currentSearchParams;
  };

  // Get available filters from Algolia search
  const { facets } = useAlgoliaSearchWithFacets(getCurrentSearchParams());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);



  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get current search parameters
      const currentSearchParams = getCurrentSearchParams();

      // Convert current search params to applied filters
      const appliedFilters = chatService.convertSearchParamsToFilters(currentSearchParams);

      // Get chat history (last 5 user messages only)
      const chatHistory = messages
        .filter(msg => msg.sender === 'user')
        .slice(-5)
        .map(msg => msg.text)
        .filter(text => text.length > 0);

      // Use facets as available filters, fallback to empty object if not available
      const currentAvailableFilters: AvailableFilters = (facets as AvailableFilters) || {
        'gender.title': {},
        'category.title': {},
        'sku.size.title': {},
        'sku.color.title': {},
        'sub_category.title': {},
      };

      // Send message to AI service
      const response = await chatService.sendMessage(
        text.trim(),
        chatHistory,
        appliedFilters,
        currentAvailableFilters
      );

      // Only navigate if filters are present and not empty
      if (response.filters && Object.keys(response.filters).length > 0) {
        const newSearchParams = chatService.convertFiltersToSearchParams(response.filters);
        const searchUrl = chatService.buildSearchUrl(newSearchParams);
        navigate(searchUrl);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.llm_response,
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: response.suggestion,
        filters: response.filters,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing chat message:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our support team.",
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: ['Try again', 'Contact support', 'Browse products manually'],
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };



  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Interface */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <ChatContainer>
          {/* Header */}
          <ChatHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HeaderAvatar>
                <BotIcon fontSize="small" />
              </HeaderAvatar>
              <HeaderTitle variant="h6">EcoFit Assistant</HeaderTitle>
            </Box>
            <CloseButton
              size="small"
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </CloseButton>
          </ChatHeader>

          {/* Messages */}
          <MessagesContainer>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1,
                }}
              >
                {message.sender === 'assistant' && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    <BotIcon fontSize="small" />
                  </Avatar>
                )}
                <Box
                  sx={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <MessageBubble $isUser={message.sender === 'user'}>
                    <Typography variant="body2">{message.text}</Typography>
                  </MessageBubble>
                  <MessageTime
                    sx={{ alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
                  >
                    {formatTime(message.timestamp)}
                  </MessageTime>
                  {message.suggestions && message.sender === 'assistant' && (
                    <SuggestionsContainer>
                      {message.suggestions.map((suggestion, index) => (
                        <SuggestionChip
                          key={index}
                          label={suggestion}
                          size="small"
                          variant="outlined"
                          onClick={() => handleSuggestionClick(suggestion)}
                        />
                      ))}
                    </SuggestionsContainer>
                  )}
                </Box>
                {message.sender === 'user' && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <BotIcon fontSize="small" />
                </Avatar>
                <TypingIndicator>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Thinking...
                    </Typography>
                  </Box>
                </TypingIndicator>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          {/* Input */}
          <InputContainer>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <StyledTextField
                ref={inputRef}
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <SendButton
                color="primary"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
              >
                <SendIcon />
              </SendButton>
            </Box>
          </InputContainer>
        </ChatContainer>
      </Slide>

      {/* FAB */}
      <StyledFab
        color="primary"
        aria-label="chat assistant"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChatIcon />
      </StyledFab>
    </>
  );
};

export default ChatAssistant; 