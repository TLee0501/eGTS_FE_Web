import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ setAuthenticated }) => {
    const [activeNavItem, setActiveNavItem] = useState(null);

    const handleMenuClick = (navItem) => {
        activeNavItem === navItem ? setActiveNavItem(null) : setActiveNavItem(navItem);
    };

    const isMenuItemActive = (navItem) => {
        return activeNavItem === navItem ? 'active' : '';
    };

    const isMenuCollapsed = (navItem) => {
        return activeNavItem === navItem ? 'collapsed' : 'collapse';
    };

    return (
        <>
            <div className='block-empty'></div>
            <section className='sidebar' id='menu'>
                <ul className='nav'>
                    {/**Dashboard*/}
                    <li>
                        <NavLink end to="/" onClick={() => handleMenuClick('dashboard')}>
                            <i className="fa-solid fa-home fa-sidebar-icon"></i>
                            <span>Trang Chủ</span>
                            <span className="arrow"></span>
                        </NavLink>
                    </li>
                    {/**Management*/}
                    <li className={`menu-dropdown ${isMenuItemActive('management')}`}>
                        <a href="##" onClick={() => handleMenuClick('management')}>
                            <i className="fa-solid fa-gear fa-sidebar-icon"></i>
                            <span>Quản Lý</span>
                            <span className="fa fa-angle-down pull-right"></span>
                        </a>
                        <ul className={`sub-menu ${isMenuCollapsed('management')}`}>
                            <li>
                                <NavLink to="/management/member">
                                    <i className="fa-solid fa-user fa-sidebar-icon"></i>
                                    <span>Thành Viên</span>
                                    <span className="arrow"></span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/management/staff">
                                    <i className="fa-solid fa-user-tie fa-sidebar-icon"></i>
                                    <span>Nhân Viên</span>
                                    <span className="arrow"></span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/management/package">
                                    <i className="fa-solid fa-box-archive fa-sidebar-icon"></i>
                                    <span>Gói Tập Luyện</span>
                                    <span className="arrow"></span>
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </section>
        </>
    )
}

export default Navbar;