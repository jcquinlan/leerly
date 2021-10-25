import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const NavLink = ({href, children}) => {
    return <LinkSpan><Link href={href}>{children}</Link></LinkSpan>;
};

const LinkSpan = styled.span`
    display: block;
    margin-bottom: 15px;
    font-size: 24px;
    transition: 0.3s;

    &:hover {
        transform: translateX(10px);
    }
`;

export default NavLink;