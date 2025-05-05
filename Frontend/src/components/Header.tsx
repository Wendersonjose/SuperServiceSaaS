import styled from 'styled-components';
import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

const HeaderContainer = styled.header`
  background-color: white;
  height: ${props => props.theme.sizes.headerHeight};
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  box-shadow: ${props => props.theme.shadows.sm};
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 40;
  margin-left: ${props => props.theme.sizes.sidebarWidth};
  transition: margin-left ${props => props.theme.transitions.default};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const ToggleSidebarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-right: 0.5rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 400px;
  margin-left: 0.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 1rem 0 2.5rem;
  border-radius: ${props => props.theme.radius.full};
  border: none;
  background-color: ${props => props.theme.colors.inputBg};
  transition: all ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => `${props.theme.colors.primary}33`};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textLight};
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const NotificationButton = styled.button`
  position: relative;
  color: ${props => props.theme.colors.text};
  margin-right: 1rem;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.error};
  color: white;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Header({ toggleSidebar, toggleMobileSidebar }: HeaderProps) {
  return (
    <HeaderContainer>
      <ToggleSidebarButton onClick={toggleSidebar}>
        <Menu size={24} />
      </ToggleSidebarButton>
      
      <ToggleSidebarButton onClick={toggleMobileSidebar}>
        <Menu size={24} />
      </ToggleSidebarButton>
      
      <SearchContainer>
        <SearchWrapper>
          <SearchIconWrapper>
            <Search size={18} />
          </SearchIconWrapper>
          <SearchInput placeholder="Pesquisar..." />
        </SearchWrapper>
      </SearchContainer>
      
      <RightContent>
        <NotificationButton>
          <Bell size={20} />
          <NotificationBadge>3</NotificationBadge>
        </NotificationButton>
      </RightContent>
    </HeaderContainer>
  );
}