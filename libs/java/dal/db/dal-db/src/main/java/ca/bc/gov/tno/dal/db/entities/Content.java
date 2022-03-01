package ca.bc.gov.tno.dal.db.entities;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import ca.bc.gov.tno.dal.db.AuditColumns;
import ca.bc.gov.tno.dal.db.ContentStatus;
import ca.bc.gov.tno.dal.db.WorkflowStatus;
import ca.bc.gov.tno.dal.db.services.Settings;

/**
 * Content class, provides a way to store content.
 */
@Entity
@Table(name = "content", schema = "public")
public class Content extends AuditColumns {
  /**
   * Primary key to identify the content.
   */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_content")
  @SequenceGenerator(name = "seq_content", allocationSize = 1)
  @Column(name = "id", nullable = false)
  private int id;

  /**
   * The status of the content.
   */
  @Column(name = "status", nullable = false)
  private ContentStatus status = ContentStatus.Draft;

  /**
   * The workflow process status of the content.
   */
  @Column(name = "workflow_status", nullable = false)
  private WorkflowStatus workflowStatus = WorkflowStatus.InProgress;

  /**
   * Foreign key to the content type.
   */
  @Column(name = "content_type_id", nullable = false)
  private int contentTypeId;

  /**
   * The content type reference.
   */
  @JsonBackReference("contentType")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "content_type_id", insertable = false, updatable = false)
  private ContentType contentType;

  /**
   * The print content reference
   */
  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "id", referencedColumnName = "content_id", insertable = true, updatable = true, nullable = true)
  private PrintContent printContent;

  /**
   * A unique headline to identify the content.
   */
  @Column(name = "headline", nullable = false)
  private String headline;

  /**
   * Foreign key to the data source.
   * This can be used to find the ContentReference.
   */
  @Column(name = "data_source_id", nullable = true)
  private Integer dataSourceId;

  /**
   * The content type reference.
   * This can be used to find the ContentReference.
   */
  @JsonBackReference("dataSource")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "data_source_id", insertable = false, updatable = false)
  private DataSource dataSource;

  /**
   * A source name.
   * This can be used to find the ContentReference.
   */
  @Column(name = "source", nullable = false)
  private String source = "";

  /**
   * The unique identifier from the source.
   * This will be used to find the ContentReference.
   */
  @Column(name = "uid")
  private String uid = "";

  /**
   * Foreign key to the license. [Regular Expire, Special Expire, Never Expire]
   */
  @Column(name = "license_id", nullable = false)
  private int licenseId;

  /**
   * The license reference.
   */
  @JsonBackReference("license")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "license_id", insertable = false, updatable = false)
  private License license;

  /**
   * Foreign key to the media type.
   */
  @Column(name = "media_type_id", nullable = false)
  private int mediaTypeId;

  /**
   * The media type reference.
   */
  @JsonBackReference("mediaType")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "media_type_id", insertable = false, updatable = false)
  private MediaType mediaType;

  /**
   * Foreign key to the series.
   */
  @Column(name = "series_id", nullable = true)
  private Integer seriesId;

  /**
   * The series reference.
   */
  @JsonBackReference("series")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "series_id", insertable = false, updatable = false)
  private Series series;

  /**
   * The page the content was from.
   */
  @Column(name = "page", nullable = false)
  private String page = "";

  /**
   * The published date.
   * For Newspaper and CP News content - the date the story is meant to be
   * published on.
   * For Snippets - set by Editor.
   * All other content - the date is managed by ingestion services.
   */
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Settings.dateTimeFormat, timezone = "UTC")
  @Column(name = "published_on")
  private ZonedDateTime publishedOn;

  /**
   * The content summary.
   */
  @Column(name = "summary", nullable = false)
  private String summary = "";

  /**
   * The content transcription.
   */
  @Column(name = "transcription", nullable = false)
  private String transcription = "";

  /**
   * The content source URL.
   */
  @Column(name = "source_url", nullable = false)
  private String sourceURL = "";

  /**
   * Foreign key to the user who owns this content.
   */
  @Column(name = "owner_id", nullable = false)
  private Integer ownerId;

  /**
   * The schedule reference.
   */
  @JsonBackReference("owner")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "owner_id", insertable = false, updatable = false)
  private User owner;

  /**
   * A collection of content actions linked to this content.
   */
  // @LazyCollection(LazyCollectionOption.FALSE)
  @Fetch(value = FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "content", fetch = FetchType.LAZY)
  private List<FileReference> fileReferences = new ArrayList<>();

  /**
   * A collection of content actions linked to this content.
   */
  // @LazyCollection(LazyCollectionOption.FALSE)
  @Fetch(value = FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "content", fetch = FetchType.LAZY)
  private List<ContentAction> contentActions = new ArrayList<>();

  /**
   * A collection of content categories linked to this content.
   */
  // @LazyCollection(LazyCollectionOption.FALSE)
  @Fetch(value = FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "content", fetch = FetchType.LAZY)
  private List<ContentCategory> contentCategories = new ArrayList<>();

  /**
   * A collection of content tags linked to this content.
   */
  // @LazyCollection(LazyCollectionOption.FALSE)
  @Fetch(value = FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "content", fetch = FetchType.LAZY)
  private List<ContentTag> contentTags = new ArrayList<>();

  /**
   * A collection of content tone pools linked to this content.
   */
  // @LazyCollection(LazyCollectionOption.FALSE)
  @Fetch(value = FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "content", fetch = FetchType.LAZY)
  private List<ContentTone> contentTones = new ArrayList<>();

  /**
   * A collection of time tracking linked to this content.
   */
  // @LazyCollection(LazyCollectionOption.FALSE)
  @Fetch(value = FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "content", fetch = FetchType.LAZY)
  private List<TimeTracking> timeTrackings = new ArrayList<>();

  /**
   * A collection of content linked to this content.
   */
  // @LazyCollection(LazyCollectionOption.FALSE)
  @Fetch(value = FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "link", fetch = FetchType.LAZY)
  private List<ContentLink> links = new ArrayList<>();

  /**
   * A collection of content logs linked to this content.
   */
  @JsonIgnore
  // @LazyCollection(LazyCollectionOption.FALSE)
  @Fetch(value = FetchMode.SUBSELECT)
  @OneToMany(mappedBy = "content", fetch = FetchType.LAZY)
  private List<ContentLog> logs = new ArrayList<>();

  /**
   * Creates a new instance of a Content object.
   */
  public Content() {

  }

  /**
   * Creates a new instance of a Content object, initializes with specified
   * parameters.
   *
   * @param id            Primary key
   * @param contentTypeId Foreign key to content type
   * @param mediaTypeId   Foreign key to media type
   * @param licenseId     Foreign key to license
   * @param seriesId      Foreign key to series
   * @param dataSourceId  Foreign key to datasource
   * @param ownerId       Foreign key to owning user
   * @param status        The status
   * @param headline      The headline
   */
  public Content(int id, int contentTypeId, int mediaTypeId, int licenseId, Integer seriesId, int dataSourceId,
      int ownerId, ContentStatus status, String headline) {
    if (headline == null)
      throw new NullPointerException("Parameter 'headline' cannot be null.");
    if (headline.length() == 0)
      throw new IllegalArgumentException("Parameter 'headline' cannot be empty.");
    if (status == null)
      throw new NullPointerException("Parameter 'status' cannot be null.");

    this.id = id;
    this.contentTypeId = contentTypeId;
    this.mediaTypeId = mediaTypeId;
    this.licenseId = licenseId;
    this.seriesId = seriesId;
    this.dataSourceId = dataSourceId;
    this.ownerId = ownerId;
    this.status = status;
    this.headline = headline;
  }

  /**
   * Creates a new instance of a Content object, initializes with specified
   * parameters.
   *
   * @param id            Primary key
   * @param contentTypeId Foreign key to content type
   * @param mediaTypeId   Foreign key to media type
   * @param licenseId     Foreign key to license
   * @param seriesId      Foreign key to series
   * @param dataSourceId  Foreign key to datasource
   * @param status        The status
   * @param headline      The headline
   */
  public Content(int id, int contentTypeId, int mediaTypeId, int licenseId, Integer seriesId, int dataSourceId,
      ContentStatus status, String headline) {
    if (headline == null)
      throw new NullPointerException("Parameter 'headline' cannot be null.");
    if (headline.length() == 0)
      throw new IllegalArgumentException("Parameter 'headline' cannot be empty.");
    if (status == null)
      throw new NullPointerException("Parameter 'status' cannot be null.");

    this.id = id;
    this.contentTypeId = contentTypeId;
    this.mediaTypeId = mediaTypeId;
    this.licenseId = licenseId;
    this.seriesId = seriesId;
    this.dataSourceId = dataSourceId;
    this.status = status;
    this.headline = headline;
  }

  /**
   * Creates a new instance of a Content object, initializes with specified
   * parameters.
   *
   * @param id            Primary key
   * @param contentTypeId Foreign key to content type
   * @param mediaTypeId   Foreign key to media type
   * @param licenseId     Foreign key to license
   * @param seriesId      Foreign key to series
   * @param source        The source of the content
   * @param ownerId       Foreign key to owning user
   * @param status        The status
   * @param headline      The headline
   */
  public Content(int id, int contentTypeId, int mediaTypeId, int licenseId, Integer seriesId, String source,
      int ownerId,
      ContentStatus status, String headline) {
    if (headline == null)
      throw new NullPointerException("Parameter 'headline' cannot be null.");
    if (headline.length() == 0)
      throw new IllegalArgumentException("Parameter 'headline' cannot be empty.");
    if (source == null)
      throw new NullPointerException("Parameter 'source' cannot be null.");
    if (source.length() == 0)
      throw new IllegalArgumentException("Parameter 'source' cannot be empty.");
    if (status == null)
      throw new NullPointerException("Parameter 'status' cannot be null.");

    this.id = id;
    this.contentTypeId = contentTypeId;
    this.mediaTypeId = mediaTypeId;
    this.licenseId = licenseId;
    this.seriesId = seriesId;
    this.source = source;
    this.ownerId = ownerId;
    this.status = status;
    this.headline = headline;
  }

  /**
   * Creates a new instance of a Content object, initializes with specified
   * parameters.
   *
   * @param id            Primary key
   * @param contentTypeId Foreign key to content type
   * @param mediaTypeId   Foreign key to media type
   * @param licenseId     Foreign key to license
   * @param seriesId      Foreign key to series
   * @param source        The source of the content
   * @param status        The status
   * @param headline      The headline
   */
  public Content(int id, int contentTypeId, int mediaTypeId, int licenseId, Integer seriesId, String source,
      ContentStatus status,
      String headline) {
    if (headline == null)
      throw new NullPointerException("Parameter 'headline' cannot be null.");
    if (headline.length() == 0)
      throw new IllegalArgumentException("Parameter 'headline' cannot be empty.");
    if (source == null)
      throw new NullPointerException("Parameter 'source' cannot be null.");
    if (source.length() == 0)
      throw new IllegalArgumentException("Parameter 'source' cannot be empty.");
    if (status == null)
      throw new NullPointerException("Parameter 'status' cannot be null.");

    this.id = id;
    this.contentTypeId = contentTypeId;
    this.mediaTypeId = mediaTypeId;
    this.licenseId = licenseId;
    this.seriesId = seriesId;
    this.source = source;
    this.status = status;
    this.headline = headline;
  }

  /**
   * Creates a new instance of a Content object, initializes with specified
   * parameters.
   *
   * @param contentType Foreign key to content type
   * @param mediaType   Foreign key to media type
   * @param license     Foreign key to the license
   * @param series      Foreign key to the series
   * @param dataSource  Foreign key to the datasource
   * @param owner       Foreign key to the owning user
   * @param status      The status
   * @param headline    The headline
   */
  public Content(ContentType contentType, MediaType mediaType, License license, Series series,
      DataSource dataSource, User owner, ContentStatus status, String headline) {
    if (headline == null)
      throw new NullPointerException("Parameter 'headline' cannot be null.");
    if (headline.length() == 0)
      throw new IllegalArgumentException("Parameter 'headline' cannot be empty.");
    if (contentType == null)
      throw new NullPointerException("Parameter 'contentType' cannot be null.");
    if (mediaType == null)
      throw new NullPointerException("Parameter 'mediaType' cannot be null.");
    if (license == null)
      throw new NullPointerException("Parameter 'license' cannot be null.");
    if (dataSource == null)
      throw new NullPointerException("Parameter 'dataSource' cannot be null.");
    if (owner == null)
      throw new NullPointerException("Parameter 'owner' cannot be null.");
    if (status == null)
      throw new NullPointerException("Parameter 'status' cannot be null.");

    this.contentType = contentType;
    this.contentTypeId = contentType.getId();
    this.mediaType = mediaType;
    this.mediaTypeId = mediaType.getId();
    this.license = license;
    this.licenseId = license.getId();
    this.series = series;
    this.seriesId = series != null ? series.getId() : null;
    this.dataSource = dataSource;
    this.dataSourceId = dataSource.getId();
    this.source = dataSource.getCode();
    this.owner = owner;
    this.ownerId = owner.getId();
    this.status = status;
    this.headline = headline;
  }

  /**
   * Creates a new instance of a Content object, initializes with specified
   * parameters.
   *
   * @param contentType Foreign key to content type
   * @param mediaType   Foreign key to media type
   * @param license     Foreign key to the license
   * @param series      Foreign key to the series
   * @param dataSource  Foreign key to the datasource
   * @param status      The status
   * @param headline    The headline
   */
  public Content(ContentType contentType, MediaType mediaType, License license, Series series,
      DataSource dataSource, ContentStatus status, String headline) {
    if (headline == null)
      throw new NullPointerException("Parameter 'headline' cannot be null.");
    if (headline.length() == 0)
      throw new IllegalArgumentException("Parameter 'headline' cannot be empty.");
    if (contentType == null)
      throw new NullPointerException("Parameter 'contentType' cannot be null.");
    if (mediaType == null)
      throw new NullPointerException("Parameter 'mediaType' cannot be null.");
    if (license == null)
      throw new NullPointerException("Parameter 'license' cannot be null.");
    if (dataSource == null)
      throw new NullPointerException("Parameter 'dataSource' cannot be null.");
    if (status == null)
      throw new NullPointerException("Parameter 'status' cannot be null.");

    this.contentType = contentType;
    this.contentTypeId = contentType.getId();
    this.mediaType = mediaType;
    this.mediaTypeId = mediaType.getId();
    this.license = license;
    this.licenseId = license.getId();
    this.series = series;
    this.seriesId = series != null ? series.getId() : null;
    this.dataSource = dataSource;
    this.dataSourceId = dataSource.getId();
    this.source = dataSource.getCode();
    this.status = status;
    this.headline = headline;
  }

  /**
   * Creates a new instance of a Content object, initializes with specified
   * parameters.
   *
   * @param contentType Foreign key to content type
   * @param mediaType   Foreign key to media type
   * @param license     Foreign key to the license
   * @param series      Foreign key to the series
   * @param source      The source of the content
   * @param owner       Foreign key to the owning user
   * @param status      The status
   * @param headline    The headline
   */
  public Content(ContentType contentType, MediaType mediaType, License license, Series series,
      String source, User owner, ContentStatus status, String headline) {
    if (headline == null)
      throw new NullPointerException("Parameter 'headline' cannot be null.");
    if (headline.length() == 0)
      throw new IllegalArgumentException("Parameter 'headline' cannot be empty.");
    if (contentType == null)
      throw new NullPointerException("Parameter 'contentType' cannot be null.");
    if (mediaType == null)
      throw new NullPointerException("Parameter 'mediaType' cannot be null.");
    if (license == null)
      throw new NullPointerException("Parameter 'license' cannot be null.");
    if (source == null)
      throw new NullPointerException("Parameter 'source' cannot be null.");
    if (source.length() == 0)
      throw new IllegalArgumentException("Parameter 'source' cannot be empty.");
    if (owner == null)
      throw new NullPointerException("Parameter 'owner' cannot be null.");
    if (status == null)
      throw new NullPointerException("Parameter 'status' cannot be null.");

    this.contentType = contentType;
    this.contentTypeId = contentType.getId();
    this.mediaType = mediaType;
    this.mediaTypeId = mediaType.getId();
    this.license = license;
    this.licenseId = license.getId();
    this.series = series;
    this.seriesId = series != null ? series.getId() : null;
    this.source = source;
    this.owner = owner;
    this.ownerId = owner.getId();
    this.status = status;
    this.headline = headline;
  }

  /**
   * Creates a new instance of a Content object, initializes with specified
   * parameters.
   *
   * @param contentType Foreign key to content type
   * @param mediaType   Foreign key to media type
   * @param license     Foreign key to the license
   * @param series      Foreign key to the series
   * @param source      The source of the content
   * @param status      The status
   * @param headline    The headline
   */
  public Content(ContentType contentType, MediaType mediaType, License license, Series series,
      String source, ContentStatus status, String headline) {
    if (headline == null)
      throw new NullPointerException("Parameter 'headline' cannot be null.");
    if (headline.length() == 0)
      throw new IllegalArgumentException("Parameter 'headline' cannot be empty.");
    if (contentType == null)
      throw new NullPointerException("Parameter 'contentType' cannot be null.");
    if (mediaType == null)
      throw new NullPointerException("Parameter 'mediaType' cannot be null.");
    if (license == null)
      throw new NullPointerException("Parameter 'license' cannot be null.");
    if (source == null)
      throw new NullPointerException("Parameter 'source' cannot be null.");
    if (source.length() == 0)
      throw new IllegalArgumentException("Parameter 'source' cannot be empty.");
    if (status == null)
      throw new NullPointerException("Parameter 'status' cannot be null.");

    this.contentType = contentType;
    this.contentTypeId = contentType.getId();
    this.mediaType = mediaType;
    this.mediaTypeId = mediaType.getId();
    this.license = license;
    this.licenseId = license.getId();
    this.series = series;
    this.seriesId = series != null ? series.getId() : null;
    this.source = source;
    this.status = status;
    this.headline = headline;
  }

  /**
   * Creates a new instance of a Content object, initializes with specified
   * parameters.
   *
   * @param contentType Foreign key to content type
   * @param contentRef  Foreign key to content reference
   * @param dataSource  Foreign key to data source
   * @param series      Foreign key to the series
   * @param owner       Foreign key to the owning user
   * @param headline    The headline
   */
  public Content(ContentType contentType, ContentReference contentRef, DataSource dataSource, Series series, User owner,
      String headline) {
    if (headline == null)
      throw new NullPointerException("Parameter 'headline' cannot be null.");
    if (headline.length() == 0)
      throw new IllegalArgumentException("Parameter 'headline' cannot be empty.");
    if (contentRef == null)
      throw new NullPointerException("Parameter 'content' cannot be null.");
    if (dataSource == null)
      throw new NullPointerException("Parameter 'dataSource' cannot be null.");
    if (contentType == null)
      throw new NullPointerException("Parameter 'contentType' cannot be null.");
    if (license == null)
      throw new NullPointerException("Parameter 'license' cannot be null.");
    if (owner == null)
      throw new NullPointerException("Parameter 'owner' cannot be null.");

    this.contentType = contentType; // TODO: Determine from content reference or data source.
    this.contentTypeId = contentType.getId();
    this.mediaType = dataSource.getMediaType();
    this.mediaTypeId = dataSource.getMediaTypeId();
    this.dataSource = dataSource;
    this.dataSourceId = dataSource.getId();
    this.license = dataSource.getLicense();
    this.licenseId = dataSource.getLicenseId();
    this.series = series;
    this.seriesId = series != null ? series.getId() : null;
    this.source = contentRef.getSource();
    this.uid = contentRef.getUid();
    this.workflowStatus = contentRef.getStatus();
    this.owner = owner;
    this.ownerId = owner.getId();
    this.headline = headline;
  }

  /**
   * Creates a new instance of a Content object, initializes with specified
   * parameters.
   *
   * @param contentType Foreign key to content type
   * @param contentRef  Foreign key to content reference
   * @param dataSource  Foreign key to data source
   * @param series      Foreign key to the series
   * @param headline    The headline
   */
  public Content(ContentType contentType, ContentReference contentRef, DataSource dataSource, Series series,
      String headline) {
    if (headline == null)
      throw new NullPointerException("Parameter 'headline' cannot be null.");
    if (headline.length() == 0)
      throw new IllegalArgumentException("Parameter 'headline' cannot be empty.");
    if (contentRef == null)
      throw new NullPointerException("Parameter 'content' cannot be null.");
    if (dataSource == null)
      throw new NullPointerException("Parameter 'dataSource' cannot be null.");
    if (contentType == null)
      throw new NullPointerException("Parameter 'contentType' cannot be null.");
    if (license == null)
      throw new NullPointerException("Parameter 'license' cannot be null.");

    this.contentType = contentType; // TODO: Determine from content reference or data source.
    this.contentTypeId = contentType.getId();
    this.mediaType = dataSource.getMediaType();
    this.mediaTypeId = dataSource.getMediaTypeId();
    this.dataSource = dataSource;
    this.dataSourceId = dataSource.getId();
    this.license = dataSource.getLicense();
    this.licenseId = dataSource.getLicenseId();
    this.series = series;
    this.seriesId = series != null ? series.getId() : null;
    this.source = contentRef.getSource();
    this.uid = contentRef.getUid();
    this.workflowStatus = contentRef.getStatus();
    this.headline = headline;
  }

  /**
   * @return int return the id
   */
  public int getId() {
    return id;
  }

  /**
   * @param id the id to set
   */
  public void setId(int id) {
    this.id = id;
  }

  /**
   * @return ContentStatus return the status
   */
  public ContentStatus getStatus() {
    return status;
  }

  /**
   * @param status the status to set
   */
  public void setStatus(ContentStatus status) {
    this.status = status;
  }

  /**
   * @return WorkflowStatus return the workflowStatus
   */
  public WorkflowStatus getWorkflowStatus() {
    return workflowStatus;
  }

  /**
   * @param workflowStatus the workflowStatus to set
   */
  public void setWorkflowStatus(WorkflowStatus workflowStatus) {
    this.workflowStatus = workflowStatus;
  }

  /**
   * @return int return the contentTypeId
   */
  public int getContentTypeId() {
    return contentTypeId;
  }

  /**
   * @param contentTypeId the contentTypeId to set
   */
  public void setContentTypeId(int contentTypeId) {
    this.contentTypeId = contentTypeId;
  }

  /**
   * @return ContentType return the contentType
   */
  public ContentType getContentType() {
    return contentType;
  }

  /**
   * @param contentType the contentType to set
   */
  public void setContentType(ContentType contentType) {
    this.contentType = contentType;
  }

  /**
   * @return String return the headline
   */
  public String getHeadline() {
    return headline;
  }

  /**
   * @param headline the headline to set
   */
  public void setHeadline(String headline) {
    this.headline = headline;
  }

  /**
   * @return Integer return the dataSourceId
   */
  public Integer getDataSourceId() {
    return dataSourceId;
  }

  /**
   * @param dataSourceId the dataSourceId to set
   */
  public void setDataSourceId(Integer dataSourceId) {
    this.dataSourceId = dataSourceId;
  }

  /**
   * @return DataSource return the dataSource
   */
  public DataSource getDataSource() {
    return dataSource;
  }

  /**
   * @param dataSource the dataSource to set
   */
  public void setDataSource(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  /**
   * @return String return the source
   */
  public String getSource() {
    return source;
  }

  /**
   * @param source the source to set
   */
  public void setSource(String source) {
    this.source = source;
  }

  /**
   * @return String return the uid
   */
  public String getUid() {
    return uid;
  }

  /**
   * @param uid the uid to set
   */
  public void setUid(String uid) {
    this.uid = uid;
  }

  /**
   * @return int return the licenseId
   */
  public int getLicenseId() {
    return licenseId;
  }

  /**
   * @param licenseId the licenseId to set
   */
  public void setLicenseId(int licenseId) {
    this.licenseId = licenseId;
  }

  /**
   * @return License return the license
   */
  public License getLicense() {
    return license;
  }

  /**
   * @param license the license to set
   */
  public void setLicense(License license) {
    this.license = license;
  }

  /**
   * @return int return the mediaTypeId
   */
  public int getMediaTypeId() {
    return mediaTypeId;
  }

  /**
   * @param mediaTypeId the mediaTypeId to set
   */
  public void setMediaTypeId(int mediaTypeId) {
    this.mediaTypeId = mediaTypeId;
  }

  /**
   * @return MediaType return the mediaType
   */
  public MediaType getMediaType() {
    return mediaType;
  }

  /**
   * @param mediaType the mediaType to set
   */
  public void setMediaType(MediaType mediaType) {
    this.mediaType = mediaType;
  }

  /**
   * @return String return the page
   */
  public String getPage() {
    return page;
  }

  /**
   * @param page the page to set
   */
  public void setPage(String page) {
    this.page = page;
  }

  /**
   * @return ZonedDateTime return the publishedOn
   */
  public ZonedDateTime getPublishedOn() {
    return publishedOn;
  }

  /**
   * @param publishedOn the publishedOn to set
   */
  public void setPublishedOn(ZonedDateTime publishedOn) {
    this.publishedOn = publishedOn;
  }

  /**
   * @return String return the summary
   */
  public String getSummary() {
    return summary;
  }

  /**
   * @param summary the summary to set
   */
  public void setSummary(String summary) {
    this.summary = summary;
  }

  /**
   * @return String return the transcription
   */
  public String getTranscription() {
    return transcription;
  }

  /**
   * @param transcription the transcription to set
   */
  public void setTranscription(String transcription) {
    this.transcription = transcription;
  }

  /**
   * @return String return the sourceURL
   */
  public String getSourceURL() {
    return sourceURL;
  }

  /**
   * @param sourceURL the sourceURL to set
   */
  public void setSourceURL(String sourceURL) {
    this.sourceURL = sourceURL;
  }

  /**
   * @return int return the ownerId
   */
  public int getOwnerId() {
    return ownerId;
  }

  /**
   * @param ownerId the ownerId to set
   */
  public void setOwnerId(int ownerId) {
    this.ownerId = ownerId;
  }

  /**
   * @return User return the owner
   */
  public User getOwner() {
    return owner;
  }

  /**
   * @param owner the owner to set
   */
  public void setOwner(User owner) {
    this.owner = owner;
  }

  /**
   * @return List{FileReference} return the fileReferences
   */
  public List<FileReference> getFileReferences() {
    return fileReferences;
  }

  /**
   * @param fileReferences the fileReferences to set
   */
  public void setFileReferences(List<FileReference> fileReferences) {
    this.fileReferences = fileReferences;
  }

  /**
   * @return List{ContentAction} return the contentActions
   */
  public List<ContentAction> getContentActions() {
    return contentActions;
  }

  /**
   * @param contentActions the contentActions to set
   */
  public void setContentActions(List<ContentAction> contentActions) {
    this.contentActions = contentActions;
  }

  /**
   * @return List{ContentCategory} return the contentCategories
   */
  public List<ContentCategory> getContentCategories() {
    return contentCategories;
  }

  /**
   * @param contentCategories the contentCategories to set
   */
  public void setContentCategories(List<ContentCategory> contentCategories) {
    this.contentCategories = contentCategories;
  }

  /**
   * @return List{ContentTag} return the contentTags
   */
  public List<ContentTag> getContentTags() {
    return contentTags;
  }

  /**
   * @param contentTags the contentTags to set
   */
  public void setContentTags(List<ContentTag> contentTags) {
    this.contentTags = contentTags;
  }

  /**
   * @return List{ContentTone} return the contentTones
   */
  public List<ContentTone> getContentTonePools() {
    return contentTones;
  }

  /**
   * @param contentTones the contentTones to set
   */
  public void setContentTonePools(List<ContentTone> contentTones) {
    this.contentTones = contentTones;
  }

  /**
   * @return List{TimeTracking} return the timeTracking
   */
  public List<TimeTracking> getTimeTrackings() {
    return timeTrackings;
  }

  /**
   * @param timeTrackings the timeTracking to set
   */
  public void setTimeTrackings(List<TimeTracking> timeTrackings) {
    this.timeTrackings = timeTrackings;
  }

  /**
   * @return List{ContentLink} return the links
   */
  public List<ContentLink> getLinks() {
    return links;
  }

  /**
   * @param links the links to set
   */
  public void setLinks(List<ContentLink> links) {
    this.links = links;
  }

  /**
   * @return PrintContent return the print content
   */
  public PrintContent getPrintContent() {
    return printContent;
  }

  /**
   * @param printContent the print content to set
   */
  public void setPrintContent(PrintContent printContent) {
    this.printContent = printContent;
  }

  /**
   * @return List{ContentTone} return the contentTones
   */
  public List<ContentTone> getContentTones() {
    return contentTones;
  }

  /**
   * @param contentTones the contentTones to set
   */
  public void setContentTones(List<ContentTone> contentTones) {
    this.contentTones = contentTones;
  }

  /**
   * @return Integer return the seriesId
   */
  public Integer getSeriesId() {
    return seriesId;
  }

  /**
   * @param seriesId the seriesId to set
   */
  public void setSeriesId(Integer seriesId) {
    this.seriesId = seriesId;
  }

  /**
   * @return Series return the series
   */
  public Series getSeries() {
    return series;
  }

  /**
   * @param series the series to set
   */
  public void setSeries(Series series) {
    this.series = series;
  }

  /**
   * @return List{ContentLog} return the logs
   */
  public List<ContentLog> getLogs() {
    return logs;
  }

  /**
   * @param logs the logs to set
   */
  public void setLogs(List<ContentLog> logs) {
    this.logs = logs;
  }
}
