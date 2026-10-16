import React from 'react';
import { RoleId } from './types';
import { SuperAdminView } from './views/SuperAdminView';
import { ManagingDirectorView } from './views/ManagingDirectorView';
import { QuotationOfficerView } from './views/QuotationOfficerView';
import { SalesOfficerView } from './views/SalesOfficerView';
import { DispatcherView } from './views/DispatcherView';
import { ProjectCoordinatorView } from './views/ProjectCoordinatorView';
import { FleetManagerView } from './views/FleetManagerView';
import { FinanceOfficerView } from './views/FinanceOfficerView';
import { FieldStaffView } from './views/FieldStaffView';
import { CustomerPortalView } from './views/CustomerPortalView';

interface RoleViewRouterProps {
  currentRole: RoleId;
  activeNav: string;
}

export const RoleViewRouter: React.FC<RoleViewRouterProps> = ({ currentRole, activeNav }) => {
  switch (currentRole) {
    case 'super_admin':
      return <SuperAdminView />;
    case 'managing_director':
      return <ManagingDirectorView />;
    case 'quotation_officer':
      return <QuotationOfficerView />;
    case 'sales_officer':
      return <SalesOfficerView />;
    case 'dispatcher':
      return <DispatcherView />;
    case 'project_coordinator':
      return <ProjectCoordinatorView />;
    case 'fleet_manager':
      return <FleetManagerView />;
    case 'finance_officer':
      return <FinanceOfficerView />;
    case 'field_staff':
      return <FieldStaffView />;
    case 'customer':
      return <CustomerPortalView />;
    default:
      return <ManagingDirectorView />;
  }
};
