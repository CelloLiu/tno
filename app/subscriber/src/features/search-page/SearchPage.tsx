import { MsearchMultisearchBody } from '@elastic/elasticsearch/lib/api/types';
import { FolderSubMenu } from 'components/folder-sub-menu';
import { SearchWithLogout } from 'components/search-with-logout';
import { Sentiment } from 'components/sentiment';
import { AdvancedSearch } from 'components/sidebar/advanced-search';
import { determinePreview } from 'features/utils';
import parse from 'html-react-parser';
import React from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useContent, useFilters, useLookup } from 'store/hooks';
import { Checkbox, Col, generateQuery, IContentModel, Loading, Row, Show } from 'tno-core';

import { useParamsToFilter } from './hooks';
import { Player } from './player/Player';
import * as styled from './styled';
import { filterFormat } from './utils';

// Simple component to display users search results
export const SearchPage: React.FC = () => {
  const [, { findContentWithElasticsearch }] = useContent();
  const navigate = useNavigate();
  const [{ actions }] = useLookup();
  const [, { getFilter }] = useFilters();

  const params = useParams();
  const [searchItems, setSearchItems] = React.useState<IContentModel[]>([]);
  const [activeContent, setActiveContent] = React.useState<IContentModel | null>(null);
  const [playerOpen, setPlayerOpen] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<IContentModel[]>([]);
  const [searchName, setSearchName] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);
  const { advancedSubscriberFilter } = useParamsToFilter();
  const urlParams = new URLSearchParams(params.query);

  const savedSearchId = Number(urlParams.get('savedSearchId'));
  React.useEffect(() => {
    if (!!savedSearchId && !searchName)
      getFilter(savedSearchId)
        .then((s) => setSearchName(s.name))
        .catch();
  });

  // function that bolds the searched text only if advanced filter is enabled for it
  const formatSearch = React.useCallback(
    (text: string) => {
      let tempText = text;
      let parseText = () => {
        if (advancedSubscriberFilter.searchTerm) return advancedSubscriberFilter.searchTerm;
        else return '';
      };
      parseText()
        .split(' e')
        .forEach((word) => {
          const regex = new RegExp(word ?? '', 'gi');
          // remove duplicates found only want unique matches, this will be varying capitalization
          const matches = text.match(regex)?.filter((v, i, a) => a.indexOf(v) === i) ?? [];
          // text.match included in replace in order to keep the proper capitalization
          // When there is more than one match, this indicates there will be varying capitalization. In this case we
          // have to iterate through the matches and do a more specific replace in order to keep the words capitalization
          if (matches.length > 1) {
            matches.forEach((match, i) => {
              let multiMatch = new RegExp(`${matches[i]}`);
              tempText = tempText.replace(multiMatch, `<b>${match}</b>`);
            });
          } else {
            // in this case there will only be one match, so we can just insert the first match
            tempText = tempText.replace(regex, `<b>${matches[0]}</b>`);
          }
        });
      if (!advancedSubscriberFilter.boldKeywords) return parse(text);
      return parse(tempText);
    },
    [advancedSubscriberFilter.searchTerm, advancedSubscriberFilter.boldKeywords],
  );

  const fetchResults = React.useCallback(
    async (filter: MsearchMultisearchBody) => {
      try {
        setIsLoading(true);
        const res: any = await findContentWithElasticsearch(filter, false);
        setSearchItems(res.hits.hits.map((h: { _source: IContentModel }) => h._source));
      } catch {
      } finally {
        setIsLoading(false);
      }
    },
    [findContentWithElasticsearch],
  );

  /** retrigger content fetch when change is applied */
  React.useEffect(() => {
    fetchResults(generateQuery(filterFormat(advancedSubscriberFilter, actions)));
    // only run when query changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.query]);

  return (
    <styled.SearchPage>
      <SearchWithLogout />
      <Row className="search-container">
        <Col className="adv-search-container">
          <AdvancedSearch onSearchPage expanded={true} />
        </Col>
        <Col className="result-container">
          <Row className="save-bar">
            <div className="title">{`Search Results (${searchName})`}</div>

            <FolderSubMenu selectedContent={selected} />
          </Row>
          <Row>
            <div className={playerOpen ? 'scroll minimized' : 'scroll'}>
              <Col className={'search-items'}>
                {searchItems.map((item) => {
                  return (
                    <Row key={item.id} className="rows">
                      <Col className="cols">
                        <Row>
                          <Col alignItems="center">
                            <Checkbox
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelected([...selected, item]);
                                } else {
                                  setSelected(selected.filter((i) => i.id !== item.id));
                                }
                              }}
                              className="checkbox"
                            />
                          </Col>
                          <Col className="tone-date">
                            <Row>
                              <Sentiment
                                value={item.tonePools?.length ? item.tonePools[0].value : 0}
                              />
                              <div className="date text-content">
                                {new Date(item.publishedOn).toDateString()}
                              </div>
                            </Row>
                          </Col>
                        </Row>
                        <div
                          className="headline text-content"
                          onClick={() => navigate(`/view/${item.id}`)}
                        >
                          {formatSearch(item.headline)}
                        </div>
                        {/* TODO: Extract text around keyword searched and preview that text rather than the first 50 words */}
                        <div className="summary text-content">
                          {formatSearch(determinePreview(item))}
                        </div>
                        <Show visible={!!item.fileReferences?.length}>
                          <button
                            onClick={() => {
                              !playerOpen && setPlayerOpen(true);
                              item.fileReferences && setActiveContent(item);
                            }}
                            className={
                              playerOpen && activeContent?.id === item.id
                                ? 'playing media-button'
                                : 'show media-button'
                            }
                          >
                            {playerOpen && activeContent?.id === item.id ? (
                              <Row>
                                <div>NOW PLAYING</div> <FaStop />
                              </Row>
                            ) : (
                              <Row>
                                <div>PLAY MEDIA</div> <FaPlay />
                              </Row>
                            )}
                          </button>
                        </Show>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
            </div>
            <Show visible={playerOpen}>
              <Col className="player">
                <Player setPlayerOpen={setPlayerOpen} content={activeContent} />
              </Col>
            </Show>
          </Row>
          {isLoading && <Loading />}
        </Col>
      </Row>
    </styled.SearchPage>
  );
};
