import React from 'react';
import { FaBuilding, FaUsers, FaBriefcase } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
    <Link to={`/directory/corporate/${companyName.toLowerCase().replace(/\s+/g, '-')}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col hover:shadow-md transition-shadow">
        <div className="p-4 border-b border-gray-100 flex items-center justify-center h-40 bg-gray-50">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={companyName}
              className="h-24 w-auto max-w-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = ''; // This will trigger the fallback
              }}
            />
          ) : (
            <FaBuilding className="h-24 w-24 text-gray-300" />
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{companyName}</h3>
          <div className="mt-auto space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <FaUsers className="mr-2 text-gray-400 flex-shrink-0" />
              <span>{headCount.toLocaleString()} employees</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaBriefcase className="mr-2 text-gray-400 flex-shrink-0" />
              <span>{jobsPosted.toLocaleString()} jobs posted</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;