

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, Loader2, UserPlus, Trash2, Camera, UserCog, DollarSign, Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { allTeacherRatings } from '@/lib/mock-data/rating-data';
import { classes } from '@/lib/mock-data/report-data';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const allUsers = {
    teachers: allTeacherRatings.map(t => ({ id: t.id, name: t.name, role: 'Teacher' as const, avatar: t.avatar, class: t.subject })),
    students: classes.flatMap(c => c.students.map(s => ({ id: s.id, name: s.name, role: 'Student' as const, avatar: `https://avatar.vercel.sh/${s.name}.png`, class: s.class })))
};

const allPermissions = [
    { id: 'financial-dashboard', label: 'Financial Dashboard Access', description: 'Grant access to the main financial dashboard to view revenue, expenses, and fee reports.', icon: DollarSign, isTeacherOnly: true },
    { id: 'hostel-updates', label: 'Hostel Updates Access', description: 'Allow this teacher to manage hostel meal plans and activity schedules.', icon: Home, isTeacherOnly: true },
    { id: 'gallery-upload', label: 'Upload to School Gallery', description: 'Allow this user to add photos and videos to the public school gallery.', icon: Camera },
    { id: 'manage-users', label: 'Manage Users', description: 'Grant permissions to add or remove teachers, students, and parents from the system.', icon: UserCog },
    { id: 'add-users', label: 'Add New Users', description: 'Allow this user to invite and add new teachers or students.', icon: UserPlus },
    { id: 'remove-users', label: 'Remove Users', description: 'Allow this user to remove existing users from the school.', icon: Trash2 },
];

type User = (typeof allUsers.teachers)[0] | (typeof allUsers.students)[0];
type PermissionState = Record<string, Record<string, boolean | string>>;

const initialPermissions: PermissionState = {
    'TCH002': { 'gallery-upload': true, 'financial-dashboard': false },
    'TCH001': { 'financial-dashboard': true, 'financial-dashboard-level': 'full' },
};

const UserList = ({ users, selectedUser, onSelectUser }: { users: User[], selectedUser: User | null, onSelectUser: (user: User) => void}) => (
    <div className="space-y-2">
        {users.map(user => (
            <button 
                key={user.id} 
                onClick={() => onSelectUser(user)}
                className={`w-full text-left p-2 rounded-md flex items-center gap-3 transition-colors ${selectedUser?.id === user.id ? 'bg-primary/10' : 'hover:bg-secondary'}`}
            >
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.class}</p>
                </div>
            </button>
        ))}
    </div>
);


export default function SpecialAccessPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<PermissionState>(initialPermissions);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const filteredUsers = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return allUsers;

        return {
            teachers: allUsers.teachers.filter(u => u.name.toLowerCase().includes(query)),
            students: allUsers.students.filter(u => u.name.toLowerCase().includes(query)),
        };
    }, [searchQuery]);
    
    const handleTogglePermission = (permissionId: string) => {
        if (!selectedUser) return;
        const currentPermissionState = !!permissions[selectedUser.id]?.[permissionId];
        setPermissions(prev => ({
            ...prev,
            [selectedUser.id]: {
                ...prev[selectedUser.id],
                [permissionId]: !currentPermissionState,
            }
        }));
    };
    
    const handleAccessLevelChange = (level: string) => {
        if (!selectedUser) return;
        setPermissions(prev => ({
            ...prev,
            [selectedUser.id]: {
                ...prev[selectedUser.id],
                'financial-dashboard-level': level,
            }
        }));
    };

    const handleSave = () => {
        if (!selectedUser) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: 'Permissions Updated',
                description: `Special access settings for ${selectedUser.name} have been saved.`,
            });
        }, 1500);
    };

    const isFinancialEnabled = selectedUser && !!permissions[selectedUser.id]?.['financial-dashboard'];
    const financialAccessLevel = (selectedUser && permissions[selectedUser.id]?.['financial-dashboard-level'] as string) || 'limited';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Special Access Management</h2>
                <p className="text-muted-foreground">Grant elevated permissions to specific users for administrative tasks.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Select a User</CardTitle>
                        <div className="relative pt-2">
                            <Search className="absolute left-2.5 top-4.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name..." 
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="h-[500px] overflow-y-auto">
                        <div className="space-y-4">
                             <div>
                                <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2">Teachers</h3>
                                <UserList users={filteredUsers.teachers} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
                            </div>
                             <div>
                                <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2">Students</h3>
                                <UserList users={filteredUsers.students} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Manage Permissions</CardTitle>
                        <CardDescription>
                            {selectedUser 
                                ? `Toggle special permissions for ${selectedUser.name}.`
                                : "Select a user from the list to manage their access."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {selectedUser ? (
                            <>
                                <div className="space-y-4">
                                {allPermissions.map(permission => {
                                    const isTeacher = selectedUser.role === 'Teacher';
                                    if(permission.isTeacherOnly && !isTeacher) return null;
                                    
                                    const isEnabled = !!permissions[selectedUser.id]?.[permission.id];
                                    
                                    return (
                                        <div key={permission.id}>
                                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex items-start gap-4">
                                                    <permission.icon className="w-6 h-6 text-primary mt-1" />
                                                    <div>
                                                        <Label htmlFor={permission.id} className="text-base font-bold flex items-center gap-2">
                                                            {permission.label}
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground">{permission.description}</p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    id={permission.id}
                                                    checked={isEnabled}
                                                    onCheckedChange={() => handleTogglePermission(permission.id)}
                                                    disabled={permission.isTeacherOnly && !isTeacher}
                                                />
                                            </div>
                                            {permission.id === 'financial-dashboard' && isEnabled && (
                                                <div className="pl-14 pt-3 space-y-2">
                                                    <Label>Access Level</Label>
                                                    <Select value={financialAccessLevel} onValueChange={handleAccessLevelChange}>
                                                        <SelectTrigger className="w-[200px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="limited">Limited Access</SelectItem>
                                                            <SelectItem value="full">Full Access</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                     <p className="text-xs text-muted-foreground">
                                                        {financialAccessLevel === 'full' ? 'User can view and manage all financial data.' : 'User can only view financial reports.'}
                                                     </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave} disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Permissions for {selectedUser.name}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-12 text-center border-2 border-dashed rounded-lg">
                                <ShieldCheck className="h-16 w-16 mb-4" />
                                <p className="font-semibold">No User Selected</p>
                                <p className="text-sm">Please select a user from the list on the left to configure their special access permissions.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    
