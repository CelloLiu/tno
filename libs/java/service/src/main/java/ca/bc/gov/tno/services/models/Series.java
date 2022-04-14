package ca.bc.gov.tno.services.models;

import java.util.ArrayList;
import java.util.List;

/**
 * Series class, provides a way to identify the different series.
 */
public class Series extends AuditColumns {
  /**
   * Primary key to identify the series.
   */
  private int id;

  /**
   * A unique name to identify the series.
   */
  private String name;

  /**
   * A description of the series.
   */
  private String description;

  /**
   * Whether this record is enabled or disabled.
   */
  private boolean isEnabled;

  /**
   * Sort order of records.
   */
  private int sortOrder;

  /**
   * A collection of content of this type.
   */
  private List<Content> contents = new ArrayList<>();

  /**
   * Creates a new instance of a Series object.
   */
  public Series() {

  }

  /**
   * Creates a new instance of a Series object, initializes with specified
   * parameters.
   *
   * @param name Unique name
   */
  public Series(String name) {
    if (name == null)
      throw new NullPointerException("Parameter 'name' cannot be null.");
    if (name.length() == 0)
      throw new IllegalArgumentException("Parameter 'name' cannot be empty.");

    this.name = name;
  }

  /**
   * Creates a new instance of a Series object, initializes with specified
   * parameters.
   *
   * @param id   Primary key
   * @param name Unique name
   */
  public Series(int id, String name) {
    this(name);
    this.id = id;
  }

  /**
   * Creates a new instance of a Series object, initializes with specified
   * parameters.
   *
   * @param id      Primary key
   * @param name    Unique name
   * @param version Row version value
   */
  public Series(int id, String name, long version) {
    this(id, name);
    this.setVersion(version);
  }

  /**
   * @return int return the id
   */
  public int getId() {
    return id;
  }

  /**
   * @return String return the name
   */
  public String getName() {
    return name;
  }

  /**
   * @param name the name to set
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * @return String return the description
   */
  public String getDescription() {
    return description;
  }

  /**
   * @param description the description to set
   */
  public void setDescription(String description) {
    this.description = description;
  }

  /**
   * @return boolean return the enabled
   */
  public boolean getIsEnabled() {
    return isEnabled;
  }

  /**
   * @param enabled the enabled to set
   */
  public void setIsEnabled(boolean enabled) {
    this.isEnabled = enabled;
  }

  /**
   * @return int return the sortOrder
   */
  public int getSortOrder() {
    return sortOrder;
  }

  /**
   * @param sortOrder the sortOrder to set
   */
  public void setSortOrder(int sortOrder) {
    this.sortOrder = sortOrder;
  }

  /**
   * @return List{Content} return the contents
   */
  public List<Content> getContents() {
    return contents;
  }

  /**
   * @param contents the contents to set
   */
  public void setContents(List<Content> contents) {
    this.contents = contents;
  }

}
