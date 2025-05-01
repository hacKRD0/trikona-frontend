import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

export interface ProfileCardProps {
  avatarUrl?: string;
  name: string;
  degree?: string;
  major?: string;
  experienceYears?: number;
  linkedInUrl?: string;
  collegeName?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  name,
  degree,
  major,
  experienceYears,
  linkedInUrl,
  collegeName,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gray-100 flex items-center justify-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="h-24 w-24 text-gray-400" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        {collegeName && (
          <p className="text-sm text-gray-600 mb-1">{collegeName}</p>
        )}
        {(degree || major) && (
          <p className="text-sm text-gray-600 mb-1">
            {degree}{degree && major ? ' in ' : ''}{major}
          </p>
        )}
        {experienceYears != null && (
          <p className="text-sm text-gray-600 mb-4">
            {experienceYears} year{experienceYears !== 1 ? 's' : ''} experience
          </p>
        )}
        {linkedInUrl && (
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-indigo-600 hover:underline text-sm"
          >
            View on LinkedIn
          </a>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
