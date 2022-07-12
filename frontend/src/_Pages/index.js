import React, { useEffect, useState } from "react";
import { Spin, Table } from 'antd';
import '../App.less';
import serverApi from "../services";

const columns = [
    {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Telefone',
        dataIndex: 'phone',
        key: 'phone',
    },
]

const mappingDataTable = (data = []) => {
    return data.map((d, i) => ({
        key: `${i}`,
        ...d
    }));
}

const Student = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])

    useEffect(() => {
        serverApi.get('/contacts')
            .then(response => {
                console.log(response);
                setData(response.data)
            })
        
        setLoading(false);
    }, [loading])

    
    return (
        <Spin size="large" spinning={loading} tip="Carregando..." >
            <Table columns={columns} dataSource={mappingDataTable(data)} pagination={false} />
        </Spin>
    )
}

export default Student;