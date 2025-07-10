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
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
  products?: any[];
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

    // Process the message and generate response
    const response = await processUserMessage(text.trim().toLowerCase());
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: 'assistant',
      timestamp: new Date(),
      suggestions: response.suggestions,
      products: response.products,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const processUserMessage = async (userInput: string): Promise<{ text: string; suggestions?: string[]; products?: any[] }> => {
    // Check for product search queries
    if (userInput.includes('yoga') || userInput.includes('mat')) {
      navigate('/search?q=yoga+mat');
      return {
        text: "Great choice! I've found some eco-friendly yoga mats for you. Our mats are made from natural rubber and sustainable materials. Check out the results!",
        suggestions: ['Show me more yoga accessories', 'What about meditation cushions?', 'Tell me about sustainable materials']
      };
    }

    if (userInput.includes('activewear') || userInput.includes('clothes') || userInput.includes('apparel')) {
      navigate('/search?category=activewear');
      return {
        text: "Perfect! I've found sustainable activewear options for you. Our clothing is made from organic cotton, recycled polyester, and other eco-friendly materials.",
        suggestions: ['Show me men\'s activewear', 'What about women\'s options?', 'Tell me about the materials']
      };
    }

    if (userInput.includes('shoes') || userInput.includes('footwear') || userInput.includes('sneakers')) {
      navigate('/search?category=footwear');
      return {
        text: "I've found some amazing eco-friendly footwear options! Our shoes are made from recycled materials and sustainable leather alternatives.",
        suggestions: ['Show me running shoes', 'What about casual sneakers?', 'Tell me about the materials']
      };
    }

    if (userInput.includes('equipment') || userInput.includes('weights') || userInput.includes('dumbbells')) {
      navigate('/search?class=equipment');
      return {
        text: "I've found sustainable fitness equipment for you! Our equipment is made from recycled materials and designed to last.",
        suggestions: ['Show me more equipment', 'What about resistance bands?', 'Tell me about durability']
      };
    }

    // Check for sustainability questions
    if (userInput.includes('sustainable') || userInput.includes('eco') || userInput.includes('green')) {
      return {
        text: "Our products are sustainable because we use organic materials, recycled fabrics, and ethical manufacturing processes. We also offset our carbon footprint and use minimal packaging. All our products are designed to last longer, reducing waste.",
        suggestions: ['Show me sustainable products', 'What materials do you use?', 'Tell me about your manufacturing', 'How do you offset carbon?']
      };
    }

    if (userInput.includes('material') || userInput.includes('fabric')) {
      return {
        text: "We use a variety of sustainable materials: organic cotton, recycled polyester, natural rubber, bamboo fabric, and Tencel. These materials are biodegradable, require less water to produce, and reduce our environmental impact.",
        suggestions: ['Show me organic cotton products', 'What about recycled materials?', 'Tell me about bamboo fabric']
      };
    }

    if (userInput.includes('manufacturing') || userInput.includes('production')) {
      return {
        text: "Our manufacturing process is ethical and sustainable. We work with certified factories that pay fair wages, use renewable energy, and implement water conservation practices. We also ensure safe working conditions.",
        suggestions: ['Show me our certifications', 'Tell me about fair trade', 'What about quality control?']
      };
    }

    // Check for help requests
    if (userInput.includes('help') || userInput.includes('assist')) {
      return {
        text: "I can help you find products, explain our sustainability practices, assist with sizing, or answer any questions about EcoFit. Just let me know what you need!",
        suggestions: ['Find products', 'Sustainability info', 'Size guide', 'Contact support', 'Shipping info']
      };
    }

    if (userInput.includes('size') || userInput.includes('fit')) {
      return {
        text: "We offer detailed size guides for all our products. You can find size charts on each product page. Our products are designed to fit comfortably and accommodate different body types. Need help with a specific item?",
        suggestions: ['Show me size charts', 'How do I measure?', 'What if it doesn\'t fit?', 'Return policy']
      };
    }

    if (userInput.includes('shipping') || userInput.includes('delivery')) {
      return {
        text: "We offer carbon-neutral shipping on all orders. Standard delivery takes 3-5 business days, and we use eco-friendly packaging materials. Free shipping on orders over $50!",
        suggestions: ['Shipping costs', 'Delivery times', 'International shipping', 'Track my order']
      };
    }

    if (userInput.includes('return') || userInput.includes('refund')) {
      return {
        text: "We have a 30-day return policy for all unused items in original packaging. Returns are free and we'll donate returned items to local charities when possible.",
        suggestions: ['How to return', 'Return shipping', 'Refund timeline', 'Damaged items']
      };
    }

    // Check for specific product searches
    const productKeywords = ['mat', 'shirt', 'pants', 'shorts', 'jacket', 'hoodie', 'bra', 'leggings', 'tank', 'sports bra'];
    const foundKeyword = productKeywords.find(keyword => userInput.includes(keyword));
    
    if (foundKeyword) {
      navigate(`/search?q=${foundKeyword}`);
      return {
        text: `I've found some great ${foundKeyword} options for you! Check out our sustainable selection.`,
        suggestions: [`Show me more ${foundKeyword}s`, 'Filter by size', 'Filter by color', 'Tell me about materials']
      };
    }

    // Default response with product suggestions
    return {
      text: "I understand you're looking for something. Let me help you find the perfect sustainable fitness products. You can ask me about specific items, categories, or our sustainability practices.",
      suggestions: ['Show me yoga products', 'Find activewear', 'What makes you sustainable?', 'Help me choose', 'Show me equipment']
    };
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