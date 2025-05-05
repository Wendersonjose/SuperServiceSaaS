import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface DashboardLayoutProps {
  isSidebarCollapsed: boolean;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main<DashboardLayoutProps>`
  flex: 1;
  margin-left: ${props => props.isSidebarCollapsed 
    ? props.theme.sizes.sidebarCollapsedWidth 
    : props.theme.sizes.sidebarWidth};
  transition: margin-left ${props => props.theme.transitions.default};
  padding-top: ${props => props.theme.sizes.headerHeight};
  min-height: 100vh;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const PageContainer = styled.div`
  padding: 1.5rem;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 2rem;
  }
`;

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };
  
  return (
    <LayoutContainer>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      
      <MainContent isSidebarCollapsed={isSidebarCollapsed}>
        <Header 
          toggleSidebar={toggleSidebar} 
          toggleMobileSidebar={toggleMobileSidebar}
        />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </MainContent>
    </LayoutContainer>
  );
}