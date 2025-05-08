import React from 'react';
import { FaBuilding } from 'react-icons/fa';

export interface ProfileCardProps {
  logoUrl?: string;
  companyName: string;
  headCount: number;
  jobsPosted?: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  logoUrl,
  companyName,
  headCount,
  jobsPosted = 0,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gray-100 flex items-center justify-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            className="h-24 w-24 object-contain"
          />
        ) : (
          <FaBuilding className="h-24 w-24 text-gray-400" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{companyName}</h3>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            Employees: {headCount}
          </p>
          <p className="text-sm text-gray-600">
            Jobs Posted: {jobsPosted}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;