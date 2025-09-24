
import { Suspense } from 'react';

export default function PrincipalUserManagementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Suspense>{children}</Suspense>;
}
