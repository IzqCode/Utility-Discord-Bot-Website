import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoggedIn() {
      try {
        await fetch(`http://${process.env.NEXT_PUBLIC_API_ROOT}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        }).then(response => response.json());
        setLoggedIn(true);
      } catch {
        // Intentionally empty - they're not logged in
      }
    }
    checkLoggedIn();
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.slice(1))
      const token = params.get('access_token')
      const tokenType = params.get('token_type')
      const expiresIn = params.get('expires_in')
      const scope = params.get('scope')
      const data = {
        token,
        tokenType,
        expiresIn,
        scope
      }
      async function logIn() {
        try {
          await fetch(`http://${process.env.NEXT_PUBLIC_API_ROOT}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include',
          })
          window.history.replaceState(null, "", "#")
          await checkLoggedIn();
        } catch (error) {
          console.error('Error:', error)
        }
      }
      if (token) {
        logIn();
      }
    }
  }, [])

  async function handleLogOut() {
    try {
      await fetch(`http://${process.env.NEXT_PUBLIC_API_ROOT}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      })
      await setLoggedIn(false);
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="main-page">
      {loggedIn ? (
      <Button
        onClick={() => handleLogOut()}
        variant="contained"
      >
        Log Out
      </Button>
      ) : (
        <Button
          href={`https://discord.com/api/oauth2/authorize?client_id=${
            process.env.NEXT_PUBLIC_DISCORD_BOT_CLIENT_ID
          }&redirect_uri=http%3A%2F%2Flocalhost%3A8080&response_type=token&scope=identify%20guilds`}
          variant="contained"
        >
          Log In
        </Button>
      )}
    </div>
  )
}

