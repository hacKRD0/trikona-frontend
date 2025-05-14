import React from 'react';
import { FaUserTie, FaBuilding, FaMapMarkerAlt, FaBriefcase, FaLinkedin } from 'react-icons/fa';

export interface ProfileProps {
  avatarUrl?: string;
  name: string;
  title: string;
  company?: string;
  experienceYears: number;
  skills?: string[];
  linkedInUrl?: string;
  location?: string;
  bio?: string;
  email?: string;
  phone?: string;
}

const Profile: React.FC<ProfileProps> = ({
  avatarUrl,
  name,
  title,
  company,
  experienceYears,
  skills,
  linkedInUrl,
  location,
  bio,
  email,
  phone,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-indigo-50 h-40 flex items-center justify-center">
        <div className="relative -bottom-16 flex justify-center">
          <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <FaUserTie className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-16 px-6 pb-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-lg text-gray-700">{title}</p>
        </div>
        
        <div className="space-y-4">
          {bio && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{bio}</p>
            </div>
          )}
          
          <div className="space-y-2">
            {company && (
              <div className="flex items-center text-gray-700">
                <FaBuilding className="mr-2 text-gray-500" />
                <span>{company}</span>
              </div>
            )}
            
            {location && (
              <div className="flex items-center text-gray-700">
                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                <span>{location}</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-700">
              <FaBriefcase className="mr-2 text-gray-500" />
              <span>{experienceYears} year{experienceYears !== 1 ? 's' : ''} of experience</span>
            </div>
            
            {email && (
              <div className="flex items-center text-gray-700">
                <span className="mr-2 text-gray-500">✉️</span>
                <a href={`mailto:${email}`} className="text-indigo-600 hover:underline">{email}</a>
              </div>
            )}
            
            {phone && (
              <div className="flex items-center text-gray-700">
                <span className="mr-2 text-gray-500">📞</span>
                <a href={`tel:${phone}`} className="text-indigo-600 hover:underline">{phone}</a>
              </div>
            )}
            
            {linkedInUrl && (
              <div className="flex items-center text-gray-700">
                <FaLinkedin className="mr-2 text-gray-500" />
                <a 
                  href={linkedInUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
          
          {skills && skills.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
