import React from 'react';
import { FaUniversity } from 'react-icons/fa';

export interface ProfileCardProps {
  logoUrl?: string;
  collegeName: string;
  studentCount: number;
  location?: string;
  programs?: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  logoUrl,
  collegeName,
  studentCount,
  location,
  programs = 0,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gray-100 flex items-center justify-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={collegeName}
            className="h-24 w-24 object-contain"
          />
        ) : (
          <FaUniversity className="h-24 w-24 text-gray-400" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{collegeName}</h3>
        {location && (
          <p className="text-sm text-gray-600 mt-1">
            {location}
          </p>
        )}
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            Students: {studentCount}
          </p>
          <p className="text-sm text-gray-600">
            Programs: {programs}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
