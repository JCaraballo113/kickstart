import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

export default () => {
    return (
        <Menu style={{ marginTop: 10 }}>
            <Link href='/' passHref>
                <a className='item'>CrowdCoin</a>
            </Link>
            <Menu.Menu position='right'>
                <Link href='/' passHref>
                    <a className='item'>Campaigns</a>
                </Link>
                <Link href='/campaigns/new' passHref>
                    <a className='item'>+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
};
