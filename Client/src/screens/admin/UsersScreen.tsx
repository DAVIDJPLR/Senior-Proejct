import AdminAppBar from "../../components/AdminAppBar";
import { Screen } from "../../custom_objects/Screens";
import { User } from "../../custom_objects/User";
import { AdminPrivilege } from "../../custom_objects/AdminPrivilege";
import AdminCard from "../../components/AdminCard";
import { Typography, Button, Popover, Modal, Table, TableBody, TableRow, TableCell, TableContainer } from "@mui/material";
import SearchBar from "../../components/SearchBar";
import { useState, useEffect } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UserCard from "../../components/UserCard";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface Props{
    currentScreen: Screen
    setCurrentScreen: (screen: Screen) => void,
}

function AdminUsers({ currentScreen, setCurrentScreen }: Props){

    const [searchVal, setSearchVal] = useState("");

    const [openAdminModal, setOpenAdminModal] = useState(false)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null)

    const privileges: AdminPrivilege[] = [
        {
            ID: 1,
            PrivilegeName: "Privilege 1"
        },
        {
            ID: 2,
            PrivilegeName: "Privilege 2"
        },
        {
            ID: 3,
            PrivilegeName: "Privilege 3"
        },
    ];

    const users: User[] = [
        {
            ID: 1,
            FirstName: "David",
            LastName: "Le Roux",
            Email: "dlaroux@azavar.com",
            Device: "device",
            Major: "Major",
            GradYear: 2025,
            AdminPrivileges: privileges
        },
        {
            ID: 2,
            FirstName: "David",
            LastName: "Le Roux",
            Email: "djpleroux@gmail.com",
            Device: "device",
            Major: "Major",
            GradYear: 2025,
            AdminPrivileges: privileges
        },
        {
            ID: 3,
            FirstName: "David",
            LastName: "Le Roux",
            Email: "lerouxdj21@gcc.edu",
            Device: "device",
            Major: "Major",
            GradYear: 2025,
            AdminPrivileges: privileges
        }
    ];

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            console.log(searchVal);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AdminAppBar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
            <div style={{ width: "90%", height: "10%", display: "flex", flexDirection: "column", alignItems: "end", justifyContent: "center" }}>
                <Button
                    variant="outlined"
                    sx={{ height: "40px", width: "40px", borderWidth: "0px", padding: 0, borderRadius: "50%", display: "flex", justifyContent: "center", minWidth: 0, zIndex: 9000 }}
                    onClick={handleClick}
                >
                    <AddCircleOutlineIcon sx={{ height: "40px", width: "40px" }} />
                </Button>
            </div>
            <SearchBar setSearchVal={setSearchVal} searchVal={searchVal} handleKeyUp={handleKeyUp} size={'small'} />
            <Typography style={{ fontSize: "24px", fontWeight: "600" }}>Current Administrators</Typography>
            {users.map((user) => <AdminCard user={user} key={user.ID} 
                onClick={() => {
                    setSelectedAdmin(user);
                    setOpenAdminModal(true);
                }} />)}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                sx={{zIndex: 9999}}
            >
                <UserModal />
            </Popover>

            <AdminModal open={openAdminModal} handleClose={ () => {setOpenAdminModal(false)} } selectedAdmin={selectedAdmin}></AdminModal>
        </div>
    );
}

interface AdminModalProps{
    open: boolean,
    handleClose: () => void,
    selectedAdmin: User | null
}

function AdminModal({ open, handleClose, selectedAdmin }: AdminModalProps) {

    const [adminPrivileges, setAdminPrivileges] = useState<AdminPrivilege[]>(
        selectedAdmin?.AdminPrivileges || []
    );

    useEffect(() => {
        setAdminPrivileges(selectedAdmin?.AdminPrivileges || [])
    }, [open]);
    
    const privileges: AdminPrivilege[] = [
        { ID: 1, PrivilegeName: 'Privilege 1' },
        { ID: 2, PrivilegeName: 'Privilege 2' },
        { ID: 3, PrivilegeName: 'Privilege 3' },
        { ID: 4, PrivilegeName: 'Privilege 4' },
        { ID: 5, PrivilegeName: 'Privilege 5' },
    ];

    const togglePrivilege = (privilege: AdminPrivilege) => {
        if (adminPrivileges.some((p) => p.ID === privilege.ID)) {
            // Remove the privilege
            setAdminPrivileges((prev) => prev.filter((p) => p.ID !== privilege.ID));
        } else {
            // Add the privilege
            setAdminPrivileges((prev) => [...prev, privilege]);
        }
    };

    return(
        <Modal 
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%", width: "100%", zIndex: 9999}}
        >
            <div
                style={{height: '70%', width: '60%', backgroundColor: 'white', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
            >
                <Typography sx={{fontSize: "22px", fontWeight: "600"}}>{selectedAdmin?.FirstName} {selectedAdmin?.LastName}</Typography>
                <Typography   sx={{fontSize: "12px", fontweight: "500", textDecoration: "underline", color: "secondary.main", cursor: "pointer"}}>{selectedAdmin?.Email}</Typography>
                <TableContainer sx={{ maxHeight: '70%', width: '90%', margin: "10px", border: "1px solid grey" }}>
                    <Table>
                        <TableBody>
                            {privileges.map((privilege) =>(
                                <TableRow key={privilege.ID}>
                                    <TableCell sx={{width: "70%"}}>{privilege.PrivilegeName}</TableCell>
                                    <TableCell sx={{width: "10%"}}>
                                        <CheckIcon
                                            onClick={() => togglePrivilege(privilege)}
                                            sx={{
                                                cursor: 'pointer',
                                                color: adminPrivileges.some(
                                                    (p) => p.ID === privilege.ID
                                                )
                                                    ? 'green'
                                                    : 'grey',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{width: "10%"}}>
                                        <CloseIcon
                                            onClick={() => togglePrivilege(privilege)}
                                            sx={{
                                                cursor: 'pointer',
                                                color: adminPrivileges.some(
                                                    (p) => p.ID === privilege.ID
                                                )
                                                    ? 'grey'
                                                    : 'red',
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: "20px"}}>
                    <Button variant="contained">Delete Admin</Button>
                    <Button variant="contained" sx={{backgroundColor: "green"}}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    );
}

function UserModal() {
    const [users, setUsers] = useState(testUsers());
    const [searchVal, setSearchVal] = useState("");

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            console.log(searchVal);
        }
    };

    return (
        <div style={{width: "40vw", height: "50vh", paddingTop: '16px', backgroundColor: 'white', borderRadius: '8px', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <SearchBar setSearchVal={setSearchVal} searchVal={searchVal} handleKeyUp={handleKeyUp} size={'small'}/>
            <div style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center", overflow: "auto"}}>
                {users.map((user) => <UserCard user={user} key={user.ID} onClick={() => {}} />)}
            </div>
        </div>
    );
}

function testUsers(): User[]{
    const privileges: AdminPrivilege[] = [
        {
            ID: 1,
            PrivilegeName: "Privilege 1"
        },
        {
            ID: 2,
            PrivilegeName: "Privilege 2"
        },
        {
            ID: 3,
            PrivilegeName: "Privilege 3"
        },
    ];

    const users: User[] = [];
    for (let i = 1; i <= 20; i++) {
        users.push({
            ID: i,
            FirstName: `FirstName${i}`,
            LastName: `LastName${i}`,
            Email: `user${i}@example.com`,
            Device: `Device${i}`,
            Major: `Major${i}`,
            GradYear: 2025,
            AdminPrivileges: privileges
        });
    }
    return users;
}

export default AdminUsers;