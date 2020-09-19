import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { usePaginatedQuery } from 'react-query';
import { useTags } from './_useTags';
import TagListInner from './TagListInner';
import TagEditModal from './TagModal';
import { appFetch } from './_fetch';
import { UserState } from './_types';

const TagList: React.FC<UserState> = ({ userId, userName, isPageOwner }) => {
  const [page, setPage] = React.useState(1);

  const getTags = React.useCallback(
    async (key: string, page = 1) =>
      await appFetch(`/api/rest/v3/tags/?user=${userId}&page=${page}&page_size=50&order_by=name`),
    []
  );
  const { isLoading, isError, error, resolvedData, latestData, isFetching } = usePaginatedQuery(
    ['tags', page],
    getTags
  );

  // Modal methods
  const [show, setShow] = useState(false);

  const handleClose = () => {
    // Clear the inputs, hide the modal
    setShow(false);
  };

  // XXX HOW TO GET THE TAG HERE FROM THE TagListInner component?
  const handleShow = (e, tag) => {
    // Get the item, populate the inputs, show the modal
    console.log(`Tag ID is: ${tag.id}`);
    setShow(true);
  };

  return (
    <>
      <h1>
        <i className="fa fa-tags gray" />
        &nbsp;{isPageOwner ? 'Your tags' : 'Public tags for ' + userName}
      </h1>
      <div className="table-responsive">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          // `resolvedData` will either resolve to the latest page's data
          // or if fetching a new page, the last successful page's data
          <TagListInner
            data={resolvedData.results}
            userName={userName}
            isPageOwner={isPageOwner}
            onEditTagClick={handleShow}
          />
        )}
      </div>

      {/*Pagination*/}
      {page === 1 && latestData && !latestData.next ? null : (
        <div className="well v-offset-above-3 hidden-print">
          <div className="row">
            <div className="col-xs-2 col-sm-3">
              {page > 1 ? (
                <div className="text-left">
                  <a onClick={() => setPage((old) => Math.max(old - 1, 0))} className="btn btn-default" rel="prev">
                    <i className="fa fa-caret-left no-underline" />
                    &nbsp;
                    <span className="hidden-xs hidden-sm">Previous</span>
                    <span className="hidden-xs hidden-md hidden-lg">Prev.</span>
                  </a>
                </div>
              ) : null}
            </div>
            <div className="col-xs-8 col-sm-6">
              <div className="text-center large">
                <span className="hidden-xs">
                  {isFetching ? (
                    <>
                      <i className="fa fa-spinner fa-pulse gray" />
                      &nbsp;Loading...
                    </>
                  ) : (
                    'Page ' + page
                  )}
                </span>
              </div>
            </div>
            <div className="col-xs-2 col-sm-3">
              {latestData && latestData.next ? (
                <div className="text-right">
                  <a
                    onClick={() =>
                      // Here, we use `latestData` so the Next Page
                      // button isn't relying on potentially old data
                      setPage((old) => (!latestData || !latestData.next ? old : old + 1))
                    }
                    rel="next"
                    className="btn btn-default"
                  >
                    <span className="hidden-xs">Next</span>&nbsp;
                    <i className="fa fa-caret-right no-underline" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title componentClass="h2">Edit Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TagList;
