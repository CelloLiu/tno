import {
  SidebarMenuItems,
  sidebarMenuItemsArray,
} from 'components/layout/constants/SidebarMenuItems';
import { SearchWithLogout } from 'components/search-with-logout';
import { ViewContent } from 'features/content/view-content';
import { Home } from 'features/home';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Row, Show } from 'tno-core';

import * as styled from './styled';

/**
 * Main landing page for the subscriber app.
 * @returns Component containing the main "box" that will correspond to the selected item in the left navigation bar. Secondary column displaying commentary and front pages.
 */
export const Landing: React.FC = () => {
  const { id } = useParams();
  const [activeItem, setActiveItem] = React.useState<string>(SidebarMenuItems.home.label);
  const navigate = useNavigate();

  /* keep active item in sync with url */
  React.useEffect(() => {
    if (id)
      setActiveItem(
        sidebarMenuItemsArray.find((item) => item.path.includes(id ?? ''))?.label ?? 'View',
      );
  }, [id]);

  return (
    <styled.Landing className="main-container">
      <Row>
        <SearchWithLogout />
      </Row>
      <Row className="contents-container">
        <Col className="main-panel">
          <Show visible={activeItem === 'View'}>
            <div className="title view">
              <FaArrowLeft onClick={() => navigate('/landing/home')} />
            </div>
          </Show>
          <Show visible={activeItem !== 'View'}>
            <div className="title">{activeItem}</div>
          </Show>
          <div className="content">
            {/* Home is default selected navigation item on login*/}
            <Show visible={activeItem === SidebarMenuItems.home.label}>
              <Home />
            </Show>
            <Show visible={activeItem === 'View'}>
              <ViewContent />
            </Show>
          </div>
        </Col>
        {/* unsure of whether these items will change depedning on selected item */}
        <Col className="right-panel">
          <div className="commentary">
            <div className="title">Commentary</div>
            <div className="content"></div>
          </div>
          <div className="front-pages">
            <div className="title">Front Pages</div>
            <div className="content"></div>
          </div>
        </Col>
      </Row>
    </styled.Landing>
  );
};
