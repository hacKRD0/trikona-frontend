import React from 'react';
import { FaUserTie } from 'react-icons/fa';

export interface ProfileCardProps {
  avatarUrl?: string;
  name: string;
  title: string;
  company?: string;
  experienceYears: number;
  skills?: string[];
  linkedInUrl?: string;
  location?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  name,
  title,
  company,
  experienceYears,
  skills,
  linkedInUrl,
  location,
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
          <FaUserTie className="h-24 w-24 text-gray-400" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
        {company && (
          <p className="text-sm text-gray-600 mb-1">{company}</p>
        )}
        {location && (
          <p className="text-sm text-gray-600 mb-1">{location}</p>
        )}
        <p className="text-sm text-gray-600 mb-2">
          {experienceYears} year{experienceYears !== 1 ? 's' : ''} experience
        </p>
        
        {skills && skills.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill) => (
                <span 
                  key={skill} 
                  className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-xs text-gray-500">+{skills.length - 3} more</span>
              )}
            </div>
          </div>
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
