import { Typography } from "@material-tailwind/react";
import { styled } from '@mui/system';

const currentYear = new Date().getFullYear();

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '14px',
}));

export function Footer() {
  return (
    <footer 
      className="fixed bottom-0 w-full text-center py-2" 
      style={{ backgroundColor: '#6e8efb', color: '#fff', fontFamily: 'Poppins', fontSize: '12px' }}
    >
      © {currentYear} Copyright:
      <a
        className="text-white"
        href="#"
        style={{ marginLeft: '5px' }}
      >
        YOGPT
      </a>
    </footer>
  );
}
