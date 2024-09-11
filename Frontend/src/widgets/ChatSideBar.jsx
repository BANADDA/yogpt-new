import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Divider, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';

const TruncatedText = styled('span')({
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100px',
});

const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
}));

const ChatSidebar = ({ onChatSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const previousChats = {
    Today: [
      { title: 'Generate a React hooks useLocalStorage', messages: 2, date: 'Today' },
    ],
    Yesterday: [
      { title: 'ex', messages: 0, date: 'Yesterday' },
    ],
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 64, // Adjust based on your navbar height
      right: 0, 
      height: 'calc(100vh - 64px)', // Adjust based on your navbar height
      display: 'flex', 
      flexDirection: 'column', 
      zIndex: 2,
      bgcolor: 'white', 
      boxShadow: 3,
      borderLeft: 1,
      borderColor: 'divider'
    }}>
      <Box sx={{ padding: 1, backgroundColor: 'white', borderBottom: 1, borderColor: 'divider' }}>
        <IconButton onClick={handleToggle}>
          <MenuIcon />
        </IconButton>
        {!isOpen && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton>
              <AddIcon />
            </IconButton>
            <IconButton>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      {isOpen && (
        <Box sx={{ width: 280, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ padding: 1, borderBottom: 1, borderColor: 'divider', backgroundColor: 'white', zIndex: 1 }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <Link href="#" variant="body2" sx={{ display: 'block', textAlign: 'center', fontSize: '0.875rem' }}>+ New Conversations</Link>
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto', padding: 1 }}>
            {Object.keys(previousChats).map((date) => (
              <React.Fragment key={date}>
                <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5, fontSize: '0.75rem' }}>
                  {date}
                </Typography>
                <List>
                  {previousChats[date].map((chat, index) => (
                    <React.Fragment key={index}>
                      <StyledListItem button onClick={() => onChatSelect(chat)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <ListItemIcon sx={{ minWidth: '30px' }}>
                            <DescriptionIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                                <TruncatedText>{chat.title}</TruncatedText>
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                {chat.messages} messages
                              </Typography>
                            }
                          />
                          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </StyledListItem>
                      {index < previousChats[date].length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </React.Fragment>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatSidebar;
