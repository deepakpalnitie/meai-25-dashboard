import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from "next/link"
import { useUser } from '../lib/hooks'

export default function ButtonAppBar(props) {
    const user = useUser()
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {props.title}
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                    {user ? (<Link href="/api/logout" passHref>
                        <Button variant="contained" color="primary">Logout</Button>
                    </Link>) :
                        (<Link href="/logout" passHref>
                        <Button variant="contained" color="primary">Login</Button>
                    </Link>)
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}
