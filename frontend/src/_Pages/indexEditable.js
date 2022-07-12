import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, Alert } from 'antd';
import serverApi from '../services';
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} é necessário.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const mappingStateColumns = (data, handleDelete) => {
    return [
        {
            title: 'Nome',
            dataIndex: 'name',
            width: '30%',
            editable: true,
        },
        {
            title: 'Telefone',
            dataIndex: 'phone',
            editable: true,
            null: true,
            render: (_, record) => !record.phone ? '-' : record.phone
            
        },
        {
            title: 'Última Atualização',
            dataIndex: 'updateAt',
            render: (_, record) => new Date(record.updatedAt).toUTCString()
        },
        {
            title: 'Data de Criação',
            dataIndex: 'createAt',
            render: (_, record) => new Date(record.updatedAt).toUTCString()
        },
        {
            title: 'Ação',
            dataIndex: 'operation',
            render: (_, record) =>
            data.dataSource?.length >= 1 ? (
                <Popconfirm title="Deseja excluir?" onConfirm={() => handleDelete(record._id)}>
                    <a>Excluir</a>
                </Popconfirm>
            ) : null,
        },
    ]
}

const EditableTable = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [components, setComponents] = useState({});
    const [columns, setColumns] = useState();
    
    useEffect(() => {
        serverApi.get('/contacts')
            .then(response => {
                if (response.data?.length) {
                    setData({
                        dataSource: response.data.map(d => {
                            return {
                                _id: d._id,
                                name: d.name,
                                phone: d.phone,
                                createdAt: d.createdAt,
                                updatedAt: d.updatedAt,
                            }
                        }),
                        count: response.data.length ?? 1,
                    })
                }
            });
        
        setComponents({
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        });
    }, [loading]);

    const updateColumns = (data) => {
        setColumns(mappingStateColumns(data, handleDelete).map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
                }),
            };
        }));
    }

    useEffect(() => {
        updateColumns(data);
        setLoading(false);
    }, [data])

    const handleDelete = (id) => {
      setLoading(false)
      const dataSource = [...data.dataSource];
      serverApi.delete(`/contacts/${id}`)
        .then((response) => {
            setData({
                dataSource: dataSource.filter((item) => item._id !== id),
              });
            setLoading(false)
        }).catch(e => {
            e.response?.data.message.forEach((value, index, array) => {
                message.error(value);
            });
            setLoading(false);
        })
    };

    const handleSave = (row) => {
        setLoading(true);
        const newData = [...data.dataSource];
        const index = newData.findIndex((item) => row._id === item._id);
        const item = newData[index];
        serverApi.patch(`/contacts/${row._id}`, row)
            .then((response) => {
                newData.splice(index, 1, { ...item, ...row });
                setData({ ...data, dataSource: newData});

                setLoading(false)
            }).catch(e => {
                message.error(e.message);
                setLoading(false);
            })
    };


  const handleAdd = () => {
    setLoading(true);
    const { count, dataSource } = data;
    const total = !count ? '' : count;
    const newData = {
      id: null,
      name: `Contato${' '+ total}`,
      phone: null,
    };
    serverApi.post('/contacts', {name: newData.name})
        .then((response) => {
            setData({
                dataSource: [...dataSource, response.data],
                count: count + 1,
              });
            updateColumns(data);
            setLoading(false)
        }).catch(e => {
            e.response?.data.message.forEach((value, index, array) => {
                message.error(value);
            });
            setLoading(false);
        })
  };

    return (
        <div style={{padding: 35}}>
          <Alert message='Dica: para editar clica em cima dos textos das colunas' type='success' style={{
              marginBottom: 16, marginTop: 16
            }} />
          <Button
            onClick={handleAdd}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Adicionar +
          </Button>
          <Table
            loading={loading}
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={data.dataSource?.sort((a, b) => { return a.name > b.name ? -1 : 1 })}
            columns={columns}
            pagination={false}
          />
        </div>
      );
}

export default EditableTable;