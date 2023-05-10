package com.gantang.dbmt.execption;

public class DbmtException extends Exception {
	private static final long serialVersionUID = -7671752323455398188L;
	/** 错误代码 */
	private String errorCode;
	/** 替换参数 */
	private String[] paramArray;
	/** 错误信息 */
	private String errorMessage;

	public DbmtException() {
		super();
	}

	public DbmtException(String errorMessage) {
		super();
		this.errorMessage = errorMessage;
	}

	public DbmtException(String errorCode, String[] paramArray) {
		super();
		this.errorCode = errorCode;
		this.paramArray = paramArray;
	}
	
	public String getErrorCode() {
		return errorCode;
	}
	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}
	public String[] getParamArray() {
		return paramArray;
	}
	public void setParamArray(String[] paramArray) {
		this.paramArray = paramArray;
	}

	public String getErrorMessage() {
		return errorMessage;
	}
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
}
