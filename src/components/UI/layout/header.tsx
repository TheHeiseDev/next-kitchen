"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/button";
import { layoutConfig } from "@/config/layout.config";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { siteConfig } from "@/config/site.config";
import { signOutFunc } from "@/actions/sign-out";
import RegistrationModal from "../modals/registration.modal";
import LoginModal from "../modals/login.modal";
import { useAuthStore } from "@/store/auth.store";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function Header() {
    const pathname = usePathname();
    
    const { isAuth, session, setAuthState, status} = useAuthStore();
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false)

    const getNavItems = () => {
      return siteConfig.navLinks
      .filter((item) => {
        if( item.href === '/ingredients') {
          return isAuth;
        }
        return true;
      })
      .map(({href, label}) => {
        const isActive = pathname === href;
        return (
          <NavbarItem key={href}>
          <Link href={href}
          className={
            `${isActive ? "text-primary" : "text-foreground"} hover:text-primary hover:underline transition-colors`
       
          }
          >
            {label}
          </Link>
        </NavbarItem>
      )
      })
    }

    const handleSignOut = async () => {
     try {
      await signOutFunc();
     } catch (error) {
      console.log('error', error);
     }

     setAuthState('unauthenticated', null);
    }

  return (
    <Navbar style={{height: layoutConfig.headerHeight }}>
      <NavbarBrand>
        <Link className="flex gap-1 items-center" href="#">
        <AcmeLogo />
        <p className="font-bold text-inherit">{siteConfig.title}</p>
        </Link>

      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {getNavItems()}
      </NavbarContent>

      <NavbarContent justify="end">
        {isAuth && <p>Привет, {session?.user?.email}</p>}
       {status === 'loading' ? <p>Загрузка... </p>: isAuth ? (
      <NavbarItem>
      <Button
        as={Link}
        color="secondary"
        href="#"
        variant="flat"
        onPress={handleSignOut}
        >
          Выйти
      </Button>
    </NavbarItem>
       ) : <>
             <NavbarItem>
      <Button
          as={Link}
          color="secondary"
          href="#"
          variant="flat"
          onPress={() => setIsLoginOpen(true)}
          >
            Логин
        </Button>
      </NavbarItem>

        <NavbarItem>
        <Button
          as={Link}
          color="secondary"
          href="#"
          variant="flat"
          onPress={() => setIsRegistrationOpen(true)}
          >
            Регистрация
        </Button>
        </NavbarItem>
       </>}
      </NavbarContent>

      <RegistrationModal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)}/>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}/>
    </Navbar>
  );
}
