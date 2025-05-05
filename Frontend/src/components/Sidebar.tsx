import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Users, 
  Briefcase, 
  UserCog, 
  DollarSign, 
  MessageSquare, 
  BarChart2, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface StyledProps {
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
}

const SidebarContainer = styled.aside<StyledProps>`
  background-color: ${props => props.theme.colors.sidebar};
  width: ${props => props.isCollapsed 
    ? props.theme.sizes.sidebarCollapsedWidth 
    : props.theme.sizes.sidebarWidth};
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  color: white;
  transition: all ${props => props.theme.transitions.default};
  overflow-y: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    transform: translateX(${props => props.isMobileOpen ? '0' : '-100%'});
    width: ${props => props.theme.sizes.sidebarWidth};
  }
`;

const LogoWrapper = styled.div<StyledProps>`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  height: ${props => props.theme.sizes.headerHeight};
  
  ${props => props.isCollapsed && css`
    justify-content: center;
    padding: 1rem 0;
  `}
`;

const MobileCloseButton = styled.button`
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const NavContainer = styled.nav`
  margin-top: 1rem;
`;

const NavItem = styled(NavLink)<StyledProps>`
  display: flex;
  align-items: center;
  padding: ${props => props.isCollapsed ? '0.75rem 0' : '0.75rem 1.5rem'};
  color: rgba(255, 255, 255, 0.7);
  transition: all ${props => props.theme.transitions.fast};
  position: relative;
  
  ${props => props.isCollapsed && css`
    justify-content: center;
  `}
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background-color: ${props => props.theme.colors.primary};
    }
  }
  
  svg {
    min-width: 20px;
  }
`;

const NavText = styled.span<StyledProps>`
  margin-left: 1rem;
  font-weight: 500;
  
  ${props => props.isCollapsed && css`
    display: none;
  `}
`;

const UserContainer = styled.div<StyledProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${props => props.isCollapsed ? '1rem 0' : '1rem 1.5rem'};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  
  ${props => props.isCollapsed && css`
    justify-content: center;
  `}
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const UserInfo = styled.div<StyledProps>`
  margin-left: 0.75rem;
  
  ${props => props.isCollapsed && css`
    display: none;
  `}
`;

const UserName = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
`;

const UserEmail = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
`;

export default function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [userInitials, setUserInitials] = useState('');
  
  useEffect(() => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length > 1) {
        setUserInitials(`${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`);
      } else {
        setUserInitials(nameParts[0].substring(0, 2).toUpperCase());
      }
    }
  }, [user]);
  
  // Close mobile sidebar when route changes
  useEffect(() => {
    onCloseMobile();
  }, [location.pathname, onCloseMobile]);
  
  return (
    <SidebarContainer isCollapsed={isCollapsed} isMobileOpen={isMobileOpen}>
      <LogoWrapper isCollapsed={isCollapsed}>
        <Logo color="white" showText={!isCollapsed} />
        <MobileCloseButton onClick={onCloseMobile}>
          <X size={24} />
        </MobileCloseButton>
      </LogoWrapper>
      
      <NavContainer>
        <NavItem to="/dashboard" isCollapsed={isCollapsed}>
          <LayoutDashboard size={20} />
          <NavText isCollapsed={isCollapsed}>Dashboard</NavText>
        </NavItem>
        <NavItem to="/appointments" isCollapsed={isCollapsed}>
          <CalendarClock size={20} />
          <NavText isCollapsed={isCollapsed}>Agendamentos</NavText>
        </NavItem>
        <NavItem to="/clients" isCollapsed={isCollapsed}>
          <Users size={20} />
          <NavText isCollapsed={isCollapsed}>Clientes</NavText>
        </NavItem>
        <NavItem to="/services" isCollapsed={isCollapsed}>
          <Briefcase size={20} />
          <NavText isCollapsed={isCollapsed}>Serviços</NavText>
        </NavItem>
        <NavItem to="/professionals" isCollapsed={isCollapsed}>
          <UserCog size={20} />
          <NavText isCollapsed={isCollapsed}>Profissionais</NavText>
        </NavItem>
        <NavItem to="/financial" isCollapsed={isCollapsed}>
          <DollarSign size={20} />
          <NavText isCollapsed={isCollapsed}>Financeiro</NavText>
        </NavItem>
        <NavItem to="/settings" isCollapsed={isCollapsed}>
          <Settings size={20} />
          <NavText isCollapsed={isCollapsed}>Configurações</NavText>
        </NavItem>
      </NavContainer>
      
      {user && (
        <UserContainer isCollapsed={isCollapsed}>
          <UserAvatar>{userInitials}</UserAvatar>
          <UserInfo isCollapsed={isCollapsed}>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserInfo>
        </UserContainer>
      )}
    </SidebarContainer>
  );
}