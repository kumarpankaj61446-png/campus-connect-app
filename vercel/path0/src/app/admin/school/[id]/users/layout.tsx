
import { Suspense } from 'react';

export default function SchoolUserManagementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Suspense>{children}</Suspense>;
}
