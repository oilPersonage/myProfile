import React from 'react';
import NavItem from './NavItem';

export default function Navigation() {
  const arrNavItem = {
    home: { text: 'Главная', link: '/home' },
    works: { text: 'Мои работы', link: '/works' },
    about: { text: 'Контакты', link: '/about' },
  };
  return (
    <div>
      {Object.keys(arrNavItem).map(item => <NavItem item={arrNavItem[item]} />)}
    </div>
  );
}
