import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar} from "@heroui/react";
import React, { useState }  from 'react'
import { CgProfile } from "react-icons/cg";
import AuthScreen from "../screens/AuthScreen";

function ProfileDropDown() {
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);

  return (

    <div className="flex items-center gap-4">
        { signedIn ? (
            <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Avatar
                    as="button"
                    className="transition-transform"
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <div>
                        <p className="text-sm font-semibold">signed in as</p>
                        <p className="text-xs">support@becodemy.com</p>
                    </div>
                </DropdownItem>
                <DropdownItem key="settings">My Profile</DropdownItem>
                <DropdownItem key="all_orders">All Orders</DropdownItem>
                <DropdownItem key="team_settings">Apply for seller account</DropdownItem>
                <DropdownItem key="logout" color="danger">Log Out</DropdownItem>
            </DropdownMenu>
            </Dropdown>
        ) : (
            <CgProfile 
            className="text-2xl cursor-pointer"
            onClick={() => setOpen(!open)}
            />
        )}
        {open && <AuthScreen setOpen={setOpen} />}
    </div>
  );
}

export default ProfileDropDown
