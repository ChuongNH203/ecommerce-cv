import React, { useState, useEffect } from 'react';
import ActionButtonsUser from './action-buttons';
import UserAdd from './user-add';
import UserList from './user-list';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const UserIndex = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstanceL.get('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      console.log("Fetched users data:", res.data);
      setUsers(res.data.data?.items|| []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateUser = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div className="flex-1 p-5">
      <div className="bg-white p-5 rounded-md shadow-sm border">
        <ActionButtonsUser onCreateUser={handleCreateUser} />
        {showCreateForm && <UserAdd onCreated={fetchUsers} />}
        <UserList searchQuery={searchQuery} users={users} onDeleted={fetchUsers} />
      </div>
    </div>
  );
};

export default UserIndex;
