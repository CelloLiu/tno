import { FormikForm } from 'components/formik';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTopics } from 'store/hooks/admin';
import {
  Button,
  ButtonVariant,
  Col,
  FieldSize,
  FlexboxTable,
  FormikCheckbox,
  FormikSelect,
  FormikText,
  FormikTextArea,
  FormPage,
  getEnumStringOptions,
  ITopicModel,
  LabelPosition,
  Modal,
  Row,
  TopicTypeName,
  useModal,
} from 'tno-core';

import { columns, defaultTopic } from './constants';
import * as styled from './styled';
import { TopicFilter } from './TopicFilter';
import { TopicSchema } from './validation/TopicSchema';

/**
 * Provides a list of all topics.
 * Provides CRUD form for topics.
 * @returns Component
 */
export const TopicList: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toggle, isShowing } = useModal();
  const [, api] = useTopics();

  const [loading, setLoading] = React.useState(false);
  const [topics, setTopics] = React.useState<ITopicModel[]>([]);
  const [items, setItems] = React.useState<ITopicModel[]>([]);
  const [topic, setTopic] = React.useState<ITopicModel>(defaultTopic);

  const topicId = Number(id);
  const topicTypeOptions = getEnumStringOptions(TopicTypeName);

  React.useEffect(() => {
    if (!items.length && !loading) {
      setLoading(true);
      api
        .findAllTopics()
        .then((data) => {
          setTopics(data.filter((t) => t.id !== 1));
          setItems(data.filter((t) => t.id !== 1));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [api, items.length, loading]);

  React.useEffect(() => {
    const topic = items.find((i) => i.id === topicId) ?? defaultTopic;
    setTopic(topic);
  }, [topicId, items]);

  const handleSubmit = async (values: ITopicModel) => {
    try {
      var results = [...items];
      if (values.id === 0) {
        const result = await api.addTopic(values);
        results = [...items, result];
      } else {
        const result = await api.updateTopic(values);
        results = items.map((i) => (i.id === values.id ? result : i));
      }
      setItems(results);
      toast.success(`${values.name} has successfully been saved.`);
    } catch {
      // Ignore error as it's handled globally.
    }
  };

  return (
    <styled.TopicList>
      <FormPage>
        <Col flex="2 1 0">
          <Col>
            <TopicFilter
              onFilterChange={(filter) => {
                if (filter && filter.length) {
                  const value = filter.toLocaleLowerCase();
                  setItems(
                    topics.filter(
                      (i) =>
                        i.name.toLocaleLowerCase().includes(value) ||
                        i.description.toLocaleLowerCase().includes(value) ||
                        i.topicType.toLocaleLowerCase().includes(value),
                    ),
                  );
                } else {
                  setItems(topics);
                }
              }}
            />
            <FlexboxTable
              rowId="id"
              data={items}
              columns={columns}
              showSort={true}
              activeRowId={id}
              onRowClick={(row) => navigate(`/admin/topics/${row.original.id}`)}
              showPaging={false}
              manualPaging={true}
              pageSize={items.length}
            />
          </Col>
        </Col>
        <Col flex="1 1 0" className="form">
          <FormikForm
            loading={false}
            validationSchema={TopicSchema}
            initialValues={topic}
            onSubmit={async (values, { setSubmitting }) => {
              await handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, values, setValues }) => (
              <>
                <Row justifyContent="flex-end">
                  <Button
                    variant={ButtonVariant.success}
                    onClick={() => navigate('/admin/topics/0')}
                  >
                    Create New Issue/Topic
                  </Button>
                </Row>
                <FormikText name="name" label="Name" />
                <FormikTextArea name="description" label="Description" />
                <Row>
                  <FormikSelect
                    label="Type"
                    name="topicType"
                    options={topicTypeOptions}
                    value={topicTypeOptions.find((o) => o.value === values.topicType)}
                    width={FieldSize.Medium}
                  />
                  <FormikCheckbox
                    labelPosition={LabelPosition.Top}
                    label="Is Enabled"
                    name="isEnabled"
                  />
                </Row>
                <Row alignContent="stretch" className="actions">
                  <Button
                    variant={ButtonVariant.danger}
                    disabled={isSubmitting || !values.id}
                    onClick={toggle}
                  >
                    Delete
                  </Button>
                  <Row flex="1 1 0" justifyContent="flex-end">
                    <Button
                      variant={ButtonVariant.secondary}
                      disabled={isSubmitting}
                      onClick={() => {
                        const find = items.find((t) => t.id === values.id);
                        if (find) {
                          setValues(find);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant={ButtonVariant.primary} disabled={isSubmitting}>
                      Save
                    </Button>
                  </Row>
                </Row>
                <Modal
                  headerText="Confirm Removal"
                  body="Are you sure you wish to remove this topic?"
                  isShowing={isShowing}
                  hide={toggle}
                  type="delete"
                  confirmText="Yes, Remove It"
                  onConfirm={async () => {
                    try {
                      await api.deleteTopic(topic);
                      setItems(items.filter((t) => t.id !== topic.id));
                      toast.success(`${topic.name} has successfully been deleted.`);
                      navigate('/admin/topics');
                    } finally {
                      toggle();
                    }
                  }}
                />
              </>
            )}
          </FormikForm>
        </Col>
      </FormPage>
    </styled.TopicList>
  );
};
